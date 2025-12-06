import time
import json
import requests
import pika
import os

RABBIT_URL = os.getenv('RABBITMQ_URL', 'amqp://guest:guest@rabbitmq:5672/')
QUEUE_NAME = os.getenv('QUEUE_NAME', 'weather_queue')

# Configuráveis via ENV
LATITUDE = os.getenv('LATITUDE', '-23.55')
LONGITUDE = os.getenv('LONGITUDE', '-46.63')
CITY = os.getenv('CITY', 'São Paulo')
INTERVAL = int(os.getenv('INTERVAL_SECONDS', '3600'))  # em segundos; padrão 1 hora

# Open-Meteo com campos úteis: temperatura, umidade, vento, probabilidade de precipitação e weathercode
OPEN_METEO = (
    'https://api.open-meteo.com/v1/forecast?'
    f'latitude={LATITUDE}&longitude={LONGITUDE}'
    '&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,precipitation_probability,weathercode'
    '&timezone=auto'
)

def connect_rabbit():
    # Tenta conectar com retry simples, útil em ambientes Docker
    while True:
        try:
            params = pika.URLParameters(RABBIT_URL)
            connection = pika.BlockingConnection(params)
            channel = connection.channel()
            channel.queue_declare(queue=QUEUE_NAME, durable=True)
            print("Connected to RabbitMQ!")
            return connection, channel
        except pika.exceptions.AMQPConnectionError:
            print("RabbitMQ not ready yet, retrying in 5s...")
            time.sleep(5)

def fetch_weather():
    try:
        r = requests.get(OPEN_METEO, timeout=10)
        data = r.json()
        
        hourly = data.get('hourly', {})
        temps = hourly.get('temperature_2m', [])
        hums = hourly.get('relativehumidity_2m', [])
        winds = hourly.get('windspeed_10m', [])
        precs = hourly.get('precipitation_probability', [])
        codes = hourly.get('weathercode', [])

        if not temps:
            return None

        # pega o último índice disponível
        idx = -1

        def safe_get(arr):
            try:
                return arr[idx]
            except Exception:
                return None

        payload = {
            'source': 'open-meteo',
            'city': CITY,
            'latitude': float(LATITUDE),
            'longitude': float(LONGITUDE),
            'temperature': safe_get(temps),
            'humidity': safe_get(hums),
            'windSpeed': safe_get(winds),
            'precipitationProbability': safe_get(precs),
            'weatherCode': safe_get(codes),
            'timestamp': int(time.time()),
            'raw': data,
        }

        return payload
    except Exception as e:
        print(f"Error fetching weather: {e}")
        return None

def main():
    print('Python collector starting...')
    conn, ch = connect_rabbit()

    try:
        while True:
            item = fetch_weather()
            if item:
                body = json.dumps(item)
                ch.basic_publish(exchange='', routing_key=QUEUE_NAME, body=body, properties=pika.BasicProperties(delivery_mode=2))
                print('Published to queue:', body[:200])
            else:
                print('No data')
            
            time.sleep(INTERVAL)
            
    except KeyboardInterrupt:
        print("Stopping collector...")
        conn.close()
    except Exception as e:
        print(f"Unexpected error: {e}")
        conn.close()

if __name__ == '__main__':
    main()