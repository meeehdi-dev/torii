package database

import (
	"context"
	"database/sql"
	"log"
	"os"
)

var Db *sql.DB

func Init() {
	dbHost := os.Getenv("DB_HOST")
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbName := os.Getenv("DB_NAME")
	dbSslMode := os.Getenv("DB_SSLMODE")

	db, err := sql.Open("postgres", "host="+dbHost+" user="+dbUser+" password="+dbPass+" dbname="+dbName+" sslmode="+dbSslMode)
	if err != nil {
		log.Fatal(err)
	}

	err = db.PingContext(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	log.Print("db connected")

	Db = db
}
