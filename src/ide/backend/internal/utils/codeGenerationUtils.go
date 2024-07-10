package utils

import (
	"archive/zip"
	"bytes"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

// Worker for code gen handler
type CodeGenWorker struct {
	PythonRunner
}

// Retrurns a new LexicoWorker object
func NewCodeGenWorker() *CodeGenWorker {
	return &CodeGenWorker{}
}

// Zips the axe program and sets it to pZipFile, returning any raised errors
func (w *CodeGenWorker) ZipProgram(axeCode string, pZipFile *bytes.Buffer) error {
	if err := godotenv.Load(); err != nil {
		return err
	}
	libsDir := os.Getenv("FOFI_LIBS_PATH")
	if libsDir == "" {
		return fmt.Errorf("Unable to get FOFI_LIBS_PATH\n")
	}

	files, err := os.ReadDir(libsDir)
	if err != nil {
		return err
	}

	var buf bytes.Buffer
	zw := zip.NewWriter(&buf)

	for _, file := range files {
		fileAbsPath := filepath.Join(libsDir, file.Name())
		loadedFile, err := os.Open(fileAbsPath)
		if err != nil {
			return err
		}
		defer loadedFile.Close()

		fZip, err := zw.Create(file.Name())
		if err != nil {
			return err
		}

		if _, err := io.Copy(fZip, loadedFile); err != nil {
			return err
		}
	}

	fZip, err := zw.Create("script.js")
	if err != nil {
		return err
	}

	if _, err := io.Copy(fZip, strings.NewReader(axeCode)); err != nil {
		return err
	}

	zw.Close()

	*pZipFile = buf
	return nil
}

// Set proper request headers and writes the file into response writter, returning any raised errors
func (w *CodeGenWorker) CreateResponse(pC *echo.Context, pZipFile *bytes.Buffer) error {
	(*pC).Response().Header().Set(echo.HeaderContentType, "application/zip")
	(*pC).Response().Header().Set(echo.HeaderContentDisposition, fmt.Sprintf("attachment; filename=\"program.zip\""))
	_, err := io.Copy((*pC).Response().Writer, pZipFile)
	return err
}
