package router

import (
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
		v1.GET("/users", users.Get)
	}

	v2 := r.Group("/v2")
	{
		v2.GET("/user/:id", users.GetOne)
	}

	v3 := r.Group("/v3")
	{
		v3.GET("/files/list", files.ListBuckets)
	}

	return r
}
