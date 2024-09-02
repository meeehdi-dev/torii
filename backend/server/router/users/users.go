package users

import (
	"log"
	"main/server/database"

	"github.com/gin-gonic/gin"
)

type User struct {
	ID    int `json:"id"`
	Email string `json:"email"`
}

func Get(c *gin.Context) {
	rows, err := database.Db.Query("SELECT id, email FROM \"user\"")
	if err != nil {
		log.Fatal(err)
	}

	users := []User{}
	for rows.Next() {
		var user User
		err := rows.Scan(&user.ID, &user.Email)
		if err != nil {
			log.Fatal(err)
		}

		users = append(users, user)
	}

	c.JSON(200, gin.H{
		"users": users,
	})
}

func GetOne(c *gin.Context) {
	row := database.Db.QueryRow("SELECT id, email FROM \"user\" WHERE id = $1", c.Param("id"))

	user := User{}
	err := row.Scan(&user.ID, &user.Email)
	if err != nil {
		log.Fatal(err)
	}

	c.JSON(200, gin.H{
		"user": user,
	})
}
