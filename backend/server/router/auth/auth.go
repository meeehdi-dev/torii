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

// TODO: handle expire via backend?
var expireTime = time.Hour * 24 * 7 // 1 week

func HasSession() gin.HandlerFunc {
	return func(c *gin.Context) {
		uuid := c.GetHeader("x-uuid")

		id, err := cache.Client.Get(context.Background(), "session_"+uuid).Result()
		if err != nil {
			log.Print(err)
			c.JSON(403, gin.H{"error": "forbidden"})
			c.Abort()
			return
		}
		cache.Client.Expire(context.Background(), "session_"+uuid, expireTime)

		c.Set("userId", id)
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

	sessionUuid := uuid.NewString()

	err = cache.Client.Set(context.Background(), "session_"+sessionUuid, user.ID, expireTime).Err()
	if err != nil {
		c.JSON(500, gin.H{"success": false})
		return
	}

	c.JSON(200, gin.H{
		"uuid": sessionUuid,
	})
}
