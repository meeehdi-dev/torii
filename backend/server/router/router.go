package router

import (
	"main/server/router/auth"
	"main/server/router/files"
	"main/server/router/ping"
	"main/server/router/users"

	"github.com/gin-gonic/gin"
)

func Init() *gin.Engine {
	r := gin.Default()

	r.GET("/ping", ping.Get)

	v1 := r.Group("/v1")
	{
		v1.POST("/login", auth.Login)
		v1.GET("/users", users.Get)
		v1.Use(auth.HasSession())
		v1.POST("/logout", auth.Logout)
		v1.GET("/user/me", users.GetMe)
		v1.GET("/user/:id", users.GetOne)
	}

	v3 := r.Group("/v3")
	{
		v3.GET("/files/list", files.ListBuckets)
	}

	return r
}
