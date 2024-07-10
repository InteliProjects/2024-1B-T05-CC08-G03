package utils

import (
	"encoding/json"

	str "Inteli-College/2024-1B-T05-CC08-G03/internal/store"
)

// Worker for lexico handler
type LexicoWorker struct {
	PythonRunner
}

// Retrurns a new LexicoWorker object
func NewLexicoWorker() *LexicoWorker {
	return &LexicoWorker{}
}

// Returns error, if any. Places tokens address into tokenList pointer
func (lw *LexicoWorker) ParseLexicalResult(s string, tokenList *[]str.Token) error {
	var tokens []str.Token
	s = s[2:]
	if err := json.Unmarshal([]byte(s), &tokens); err != nil {
		return err
	}
	*tokenList = tokens
	return nil
}
