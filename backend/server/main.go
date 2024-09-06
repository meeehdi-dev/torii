package main

import (
	"log"
	"main/server/cache"
	"main/server/database"
	"main/server/router"
	"main/server/router/files"
	"net"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {
	godotenv.Load(".env.local")

	r := router.Init()
	database.Init()
	cache.Init()
	files.Init()

	err := r.Run(net.JoinHostPort("localhost", os.Getenv("PORT")))
	if err != nil {
		log.Fatal(err)
	}
}
