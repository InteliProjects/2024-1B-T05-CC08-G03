package handlers

import (
	"fmt"
	"net/http"

	"Inteli-College/2024-1B-T05-CC08-G03/internal/store"
	u "Inteli-College/2024-1B-T05-CC08-G03/internal/utils"

	"github.com/labstack/echo/v4"
)

// Handler for Lexical Analyser
type LexicoHandler struct {
}

// Returns new LexicoHandler object
func NewLexicoHandler() *LexicoHandler {
	return &LexicoHandler{}
}

// Runs the lexical analyzer returning any raised echo errors, including tokens response
func (h *LexicoHandler) AnalyzeLexically(c echo.Context) error {
	var body string
	if err := u.GetReqBody(c, &body); err != nil {
		u.GetCustomError().PrintMsg(err)
		return c.String(http.StatusBadRequest, "Error when parsing request body\n")
	}

	if body == "" {
		return c.JSON(http.StatusOK, make([]string, 0))
	}

	lw := u.NewLexicoWorker()
	var tokensString string
	if err := lw.RunSubprocess(body, "COMPILER_PATH", "lexico", &tokensString); err != nil || tokensString[0] != '0' {
		if err != nil {
			u.GetCustomError().PrintMsg(err)
		} else {
            u.GetCustomError().PrintMsg(fmt.Errorf(tokensString[2:]))
		}
		return c.String(http.StatusBadRequest, "Error when compiling tokens\n")
	}

	var tokens []store.Token
	if err := lw.ParseLexicalResult(tokensString, &tokens); err != nil {
		u.GetCustomError().PrintMsg(err)
		return c.String(http.StatusInternalServerError, "Error when parsing tokens\n")
	}

	return c.JSON(http.StatusOK, tokens)
}
