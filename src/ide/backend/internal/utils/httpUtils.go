package utils

import (
	"fmt"
	"io"

	"github.com/labstack/echo/v4"
)

func NilQueryParamMsg(param string) string {
	return fmt.Sprintf("You must give \"%v\" as a query param. e.g. \"/find/?%v=<value>\"\n", param, param)
}

// Returns error, if raised any. Sets the pBody pointer value to request body
func GetReqBody(c echo.Context, pBody *string) error {
	bodyBytes, err := io.ReadAll(c.Request().Body)
	if err != nil {
		return err
	}
	bodyString := string(bodyBytes)
	*pBody = bodyString
	return nil
}
