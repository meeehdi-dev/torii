package router

import (
	"log"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestPingRoute(t *testing.T) {
	r := Init()

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/ping", nil)
	r.ServeHTTP(w, req)

	if w.Code != 200 || w.Body.String() != "pong" {
		log.Fatal("nope")
	}
}
