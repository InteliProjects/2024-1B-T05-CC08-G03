package utils

// Worker for semantico handler
type SemanticoWorker struct{ PythonRunner }

// Retrurns a new SemanticoWorker object
func NewSemanticoWorker() *SemanticoWorker {
	return &SemanticoWorker{}
}


