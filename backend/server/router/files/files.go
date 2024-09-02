package files

import (
	"context"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

var MinioClient *minio.Client

func Init() {
	endpoint := os.Getenv("MINIO_ENDPOINT")
	accessKeyID := os.Getenv("MINIO_ACCESSKEYID")
	secretAccessKey := os.Getenv("MINIO_SECRETACCESSKEY")
	useSSL := false

	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		log.Fatal(err)
	}

	MinioClient = minioClient
}

func ListBuckets(c *gin.Context) {
	buckets, err := MinioClient.ListBuckets(context.Background())
	if err != nil {
		log.Print("bucket list err")
    // TODO: return err?
	}

	c.JSON(200, gin.H{
		"buckets": buckets,
	})
}
