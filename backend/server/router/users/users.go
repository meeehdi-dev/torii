package users

import (
	"log"
	"main/server/database"

	"github.com/gin-gonic/gin"
)

type User struct {
	ID    int    `json:"id"`
	Email string `json:"email"`
}

func Get(c *gin.Context) {
	rows, err := database.Db.Query("SELECT id, email FROM \"user\"")
	if err != nil {
		log.Print(err)
		c.JSON(500, gin.H{
			"error": err,
		})
		return
	}

	users := []User{}
	for rows.Next() {
		var user User
		err := rows.Scan(&user.ID, &user.Email)
		if err != nil {
			log.Print(err)
			c.JSON(500, gin.H{
				"error": err,
			})
			return
		}

		users = append(users, user)
	}

	c.JSON(200, gin.H{
		"users": users,
	})
}

func GetMe(c *gin.Context) {
	userId := c.MustGet("userId")

	row := database.Db.QueryRow("SELECT id, email FROM \"user\" WHERE id = $1", userId)

	user := User{}
	err := row.Scan(&user.ID, &user.Email)
	if err != nil {
		log.Print(err)
		c.JSON(500, gin.H{
			"error": err,
		})
		return
	}

	c.JSON(200, gin.H{
		"user": user,
	})
}

func GetOne(c *gin.Context) {
	row := database.Db.QueryRow("SELECT id, email FROM \"user\" WHERE id = $1", c.Param("id"))

	user := User{}
	err := row.Scan(&user.ID, &user.Email)
	if err != nil {
		log.Print(err)
		c.JSON(500, gin.H{
			"error": err,
		})
		return
	}

	c.JSON(200, gin.H{
		"user": user,
	})
}
