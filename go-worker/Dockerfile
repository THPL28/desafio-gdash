FROM golang:1.20-alpine
WORKDIR /app
COPY go.mod go.sum ./
COPY . .
RUN go mod tidy
RUN go build -o worker

CMD ["./worker"]