package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

// Handler for the index page
type IndexHandler struct{}

// Returns http string response
func (h *IndexHandler) ServeIndexPage(c echo.Context) error {
    return c.HTML(http.StatusOK, "<style>*{text-align:center;diplay:flex;margin:auto}</style><h1>Hello World from the server</h1><img src=\"https://github.com/bashbunni/bashbunni/raw/main/dancing-gopher.gif\"/>")
}

// Returns an IndexHandler object
func NewIndexHandler() *IndexHandler {
	return &IndexHandler{}
}
