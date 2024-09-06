package main

import (
	"log"
	"main/server/database"
	"main/server/router"
	"main/server/router/files"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	godotenv.Load(".env.local")

	r := router.Init()
	database.Init()
	files.Init()

	err := r.Run("localhost:" + os.Getenv("PORT"))
	if err != nil {
		log.Fatal(err)
	}
}
