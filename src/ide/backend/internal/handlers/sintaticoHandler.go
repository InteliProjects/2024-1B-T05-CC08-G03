package handlers

import (
	"fmt"
	"net/http"

	u "Inteli-College/2024-1B-T05-CC08-G03/internal/utils"

	"github.com/labstack/echo/v4"
)

// Handler for the Syntatical Analyzer
type SintaticoHandler struct{}

// Returns new SintaticoHandler object
func NewSintaticoHandler() *SintaticoHandler {
	return &SintaticoHandler{}
}

// Runs the parser returning any raised echo errors, including tokens response
func (h *SintaticoHandler) AnalyzeSyntactically(c echo.Context) error {
	var body string
	if err := u.GetReqBody(c, &body); err != nil {
		u.GetCustomError().PrintMsg(err)
		return c.String(http.StatusInternalServerError, "Error when parsing request body\n")
	}

	if body == "" {
		return c.String(http.StatusOK, "")
	}

	sw := u.NewSintaticoWorker()
	var treeString string
	if err := sw.RunSubprocess(body, "COMPILER_PATH", "sintatico", &treeString); err != nil || treeString[0] != '0' {
        if err != nil {
            u.GetCustomError().PrintMsg(err)
        } else {
            u.GetCustomError().PrintMsg(fmt.Errorf(treeString[2:]))
        }
		return c.String(http.StatusBadRequest, "Error when parsing tokens\n")
	}

    return c.String(http.StatusOK, treeString[2:])
}
