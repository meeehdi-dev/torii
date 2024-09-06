package auth

import (
	"log"
	"main/server/database"
	"main/server/router/users"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type Session struct {
	ID   int
	uuid string
}

var Sessions = []Session{}

func HasSession() gin.HandlerFunc {
	return func(c *gin.Context) {
		uuid, err := c.Cookie("session")
		if err != nil {
			log.Println(err)
			c.JSON(403, gin.H{"error": "forbidden"})
			c.Abort()
			return
		}

		found := false
		for _, session := range Sessions {
			if session.uuid == uuid {
				found = true
			}
		}

		if !found {
			c.JSON(403, gin.H{"error": "forbidden"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// TODO: password encrypt (+ salt)
// TODO: password check
// TODO: Use redis to store sessions

func Login(c *gin.Context) {
	log.Println(c.PostForm("email"))
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
	Sessions = append(Sessions, Session{
		ID:   user.ID,
		uuid: sessionUuid,
	})

	c.SetCookie("session", sessionUuid, 3600, "/", "localhost", false, false)

	c.JSON(200, gin.H{
		"success": true,
	})
}
