package utils

// Worker for sintatico handler
type SintaticoWorker struct {
	PythonRunner
}

// Returns new SintaticoWorker object
func NewSintaticoWorker() *SintaticoWorker {
	return &SintaticoWorker{}
}
