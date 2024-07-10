package store

import (
	t "time"
)

// Type for lexical analyser token
type Token struct {
	Type string `json:"tipo"`
	Exp  string `json:"valor"`
	Line uint64 `json:"linha"`
}

// Type for the therapist's patient
type Patient struct {
	Name        string    `json:"nome" bson:"nome"`
	PatientCode string    `json:"codigo" bson:"codigo"`
	Therapies   []Therapy `json:"terapias" bson:"terapias"`
	DateCreated t.Time    `json:"dataCriacao" bson:"dataCriacao"`
}

// Set patient DateCreated to now
func (p *Patient) SetTime() {
	sp := t.FixedZone("America/Sao_Paulo", -3*3600)
	p.DateCreated = t.Now().In(sp)
}

// Type for the therapist's Session
type Therapy struct {
	SourceCode     string `json:"codigoFonte" bson:"codigoFonte"`
	TranspiledCode string `json:"codigoTranspilado" bson:"codigoTranspilado"`
	Date           t.Time `json:"dataTerapia" bson:"dataTerapia"`
}
