package handlers

import (
	"fmt"
	"net/http"

	u "Inteli-College/2024-1B-T05-CC08-G03/internal/utils"

	"github.com/labstack/echo/v4"
)

// Handler for the Semantic Analyzer
type SemanticoHandler struct{}

// Returns new SemanticoHandler object
func NewSemanticoHandler() *SemanticoHandler {
	return &SemanticoHandler{}
}

// Runs the semantic analyzer returning any raised echo errors, including tokens response
func (h *SemanticoHandler) AnalyzeSemantically(c echo.Context) error {
	var body string
	if err := u.GetReqBody(c, &body); err != nil {
		u.GetCustomError().PrintMsg(err)
		return c.String(http.StatusInternalServerError, "Error when parsing request body\n")
	}

	if body == "" {
		return c.String(http.StatusOK, "")
	}

	sw := u.NewSemanticoWorker()
	var output string
	if err := sw.RunSubprocess(body, "COMPILER_PATH", "semantico", &output); err != nil || output[0] != '0' {
		if err != nil {
			u.GetCustomError().PrintMsg(err)
		} else {
			u.GetCustomError().PrintMsg(fmt.Errorf(output[3:]))
		}
		return c.String(http.StatusInternalServerError, "Error when compiling code\n")
	}
	return nil
}
