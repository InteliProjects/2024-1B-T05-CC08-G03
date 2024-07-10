package handlers

import (
	"bytes"
	"fmt"
	"net/http"

	u "Inteli-College/2024-1B-T05-CC08-G03/internal/utils"

	"github.com/labstack/echo/v4"
)

// Handler for the code generator
type CodeGenHandler struct{}

// Returns new CodeGenHandler object
func NewCodeGenHandler() *CodeGenHandler {
	return &CodeGenHandler{}
}

// Run Code Generator returning any raised echo errors, including tokens response
func (h *CodeGenHandler) GenerateCode(c echo.Context) error {
	var body string
	if err := u.GetReqBody(c, &body); err != nil {
		u.GetCustomError().PrintMsg(err)
		return c.String(http.StatusInternalServerError, "Error when parsing request body\n")
	}

	if body == "" {
		return c.JSON(http.StatusOK, make([]string, 0))
	}

	cgw := u.NewCodeGenWorker()
	var htmlCode string
	if err := cgw.RunSubprocess(body, "COMPILER_PATH", "gerador", &htmlCode); err != nil || htmlCode[0] != '0' {
		if err != nil {
			u.GetCustomError().PrintMsg(err)
		} else {
			u.GetCustomError().PrintMsg(fmt.Errorf(htmlCode[3:]))
		}
		return c.String(http.StatusInternalServerError, "Error when compiling code\n")
	}

	var zipFile bytes.Buffer
	err := cgw.ZipProgram(htmlCode[2:], &zipFile)
	if err != nil {
		u.GetCustomError().PrintMsg(err)
		return c.String(http.StatusInternalServerError, "Couldn't compress file\n")
	}

	if err := cgw.CreateResponse(&c, &zipFile); err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Error sending file data\n")
	}
	return nil
}
