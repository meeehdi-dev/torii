package ping

import "github.com/gin-gonic/gin"

func Get(c *gin.Context) {
	c.String(200, "pong")
}
