package utils

import (
	"fmt"
	"net"
	"time"
)

// Verify if port is available for usage
func IsPortAvailable(port int) bool {
	_, err := net.DialTimeout("tcp", fmt.Sprintf(":%v", port), time.Second)
	if err != nil {
		return true
	}
	return false
}
