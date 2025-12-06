package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

func failOnError(err error, msg string) {
	if err != nil {
		log.Panicf("%s: %s", msg, err)
	}
}

func main() {
	rabbitURL := os.Getenv("RABBITMQ_URL")
	if rabbitURL == "" {
		rabbitURL = "amqp://guest:guest@rabbitmq:5672/"
	}

	backendURL := os.Getenv("BACKEND_URL")
	if backendURL == "" {
		backendURL = "http://backend:3001"
	}

	var conn *amqp.Connection
	var err error

	// Retry connection
	for {
		conn, err = amqp.Dial(rabbitURL)
		if err == nil {
			break
		}
		log.Printf("RabbitMQ not ready: %s. Retrying in 5s...", err)
		time.Sleep(5 * time.Second)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"weather_queue", // name
		true,            // durable
		false,           // delete when unused
		false,           // exclusive
		false,           // no-wait
		nil,             // arguments
	)
	failOnError(err, "Failed to declare a queue")

	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		false,  // auto-ack (we will ack manually)
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	failOnError(err, "Failed to register a consumer")

	forever := make(chan struct{})

	go func() {
		for d := range msgs {
			log.Printf("Received a message: %s", d.Body)

			var data map[string]interface{}
			if err := json.Unmarshal(d.Body, &data); err != nil {
				log.Printf("Error decoding JSON: %s", err)
				d.Nack(false, false) // Reject
				continue
			}

			// Transform data if needed. Coleta campos com checagem de tipos
			getString := func(key string) string {
				if v, ok := data[key]; ok {
					if s, ok2 := v.(string); ok2 {
						return s
					}
					// tentar converter de float
					if f, ok2 := v.(float64); ok2 {
						return fmt.Sprintf("%v", f)
					}
				}
				return ""
			}

			getFloat := func(key string) float64 {
				if v, ok := data[key]; ok {
					switch t := v.(type) {
					case float64:
						return t
					case int:
						return float64(t)
					case string:
						if parsed, err := strconv.ParseFloat(t, 64); err == nil {
							return parsed
						}
					}
				}
				return 0
			}

			// Use timestamp from payload if available
			var ts interface{}
			if v, ok := data["timestamp"]; ok {
				ts = v
			} else {
				ts = time.Now()
			}

			payload := map[string]interface{}{
				"city":        getString("city"),
				"temperature": getFloat("temperature"),
				"humidity":    getFloat("humidity"),
				"windSpeed":   getFloat("windSpeed"),
				"precipitationProbability": getFloat("precipitationProbability"),
				"weatherCode": getFloat("weatherCode"),
				"condition":   getString("condition"),
				"raw":         data["raw"],
				"timestamp":   ts,
			}

			jsonData, _ := json.Marshal(payload)

			// Send to NestJS
			resp, err := http.Post(backendURL+"/weather/logs", "application/json", bytes.NewBuffer(jsonData))
			if err != nil {
				log.Printf("Error sending to backend: %s", err)
				d.Nack(false, true) // Requeue
				continue
			}
			defer resp.Body.Close()

			if resp.StatusCode >= 200 && resp.StatusCode < 300 {
				log.Printf("Successfully sent to backend")
				d.Ack(false)
			} else {
				log.Printf("Backend returned error: %d", resp.StatusCode)
				d.Nack(false, true) // Requeue
			}
		}
	}()

	log.Printf(" [*] Waiting for messages. To exit press CTRL+C")
	<-forever
}
