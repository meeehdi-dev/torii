package auth

import (
	"context"
	"log"
	"main/server/cache"
	"main/server/database"
	"main/server/router/users"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func HasSession() gin.HandlerFunc {
	return func(c *gin.Context) {
		log.Print("YO???")
		uuid, err := c.Cookie("session")
		if err != nil {
			log.Println(err)
			c.JSON(403, gin.H{"error": "forbidden"})
			c.Abort()
			return
		}

		err = cache.Client.Get(context.Background(), "session_"+uuid).Err()
		if err != nil {
			log.Print(err)
			c.JSON(403, gin.H{"error": "forbidden"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// TODO: password encrypt (+ salt)
// TODO: password check

func Login(c *gin.Context) {
	row := database.Db.QueryRow("SELECT id, email FROM \"user\" WHERE email = $1", c.PostForm("email"))

	user := users.User{}
	err := row.Scan(&user.ID, &user.Email)
	if err != nil {
		log.Println(err)
		c.JSON(403, gin.H{
			"error": "forbidden",
		})
		return
	}

	uuid.NewString()

	sessionUuid := uuid.NewString()

	err = cache.Client.Set(context.Background(), "session_"+sessionUuid, user.ID, time.Hour).Err()
	if err != nil {
		c.JSON(500, gin.H{"success": false})
		return
	}

	c.SetCookie("session", sessionUuid, 3600, "/", "localhost", false, false)

	c.JSON(200, gin.H{
		"success": true,
	})
}
