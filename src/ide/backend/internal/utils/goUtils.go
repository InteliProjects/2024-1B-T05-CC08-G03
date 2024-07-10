package utils

import (
	"bytes"
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/joho/godotenv"
)

// A type for handling custom errors
type CustomError struct{}

// Prints custom formatting of an error message to the console
func (_ *CustomError) PrintMsg(err error) {
    if err != nil {
        fmt.Printf("--- ERROR ---\n%v-------------\n", err)
    } else {
        fmt.Printf("--- ERROR ---\n%v\n-------------\n", err)
    }
}

// Retuns the inputted string with .EOF at the end
func addEOF(s string) string {
	s += "\n.EOF\n"
	return s
}

// Returns a new CustomError object
func GetCustomError() *CustomError {
	return &CustomError{}
}

// A type for handling python subprocesses
type PythonRunner struct{}

// Runs python subprocess and returns errors, if any are raised. Sets the pStdout pointer to stdout address
func (_ *PythonRunner) RunSubprocess(s string, programVariable string, programArgs string, pStdout *string) error {
	if err := godotenv.Load(); err != nil {
		return err
	}

	compiler_package := os.Getenv(programVariable)

	compiler_program := fmt.Sprintf("%v %v", filepath.Join(compiler_package, "compiler.py"), programArgs)
	compiler_venv := filepath.Join(compiler_package, ".venv/bin/activate")
	command := fmt.Sprintf("source %v && python %v && deactivate", compiler_venv, compiler_program)

	subprocess := exec.Command("bash", "-c", command)
	subprocessStdin, err := subprocess.StdinPipe()
	if err != nil {
		return err
	}

	defer subprocessStdin.Close()

	var out bytes.Buffer
	subprocess.Stdout = &out

	if err = subprocess.Start(); err != nil {
		return err
	}

	s = addEOF(s)
	io.WriteString(subprocessStdin, s)

	if err := subprocess.Wait(); err != nil {
		return fmt.Errorf("%v\n%v\n", err.Error(), out.String())
	}

	stdout := out.String()
	*pStdout = stdout
	return nil
}
