package utils

import (
	"context"
	"fmt"
	"net/http"

	s "Inteli-College/2024-1B-T05-CC08-G03/internal/store"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// Aggregates functions for handling patients in DB
type PatientWorker struct{}

// Aggregates functions for handling therapists in DB
type TherapistWorker struct{}

// Worker for DbHandler
type DbWorker struct {
	PatientWorker
	TherapistWorker
}

// Returns NewDbWorker
func NewDbWorker() *DbWorker {
	return &DbWorker{}
}

// Returns httpStatusCode, Error message to be displayed to client and errors if any are raised
func (w *PatientWorker) CreatePatient(c *mongo.Client, p *s.Patient) (int, string, error) {
	p.SetTime()

	coll := c.Database("db").Collection("patients")

	_, err := coll.InsertOne(context.TODO(), p)
	if err != nil {
		return http.StatusInternalServerError, "Error when inserting data to database", err
	}

	return http.StatusOK, fmt.Sprintf("Inserted %v into db sucessfuly", p.Name), nil
}

// Returns httpStatusCode, Error message to be displayed to client and errors if any are raised, also sets db patient list to p pointer
func (w *PatientWorker) FetchPatients(c *mongo.Client, p *[]s.Patient) (int, string, error) {
	coll := c.Database("db").Collection("patients")
	cursor, err := coll.Find(context.TODO(), bson.D{})
	if err != nil {
		return http.StatusInternalServerError, "Error when fetching data from database", err
	}

	var patients []s.Patient
	if err := cursor.All(context.TODO(), &patients); err != nil {
		return http.StatusInternalServerError, "Error when parsing data from database", err
	}

	*p = patients

	return http.StatusOK, "", nil
}

// Returns httpStatusCode, Error message to be displayed to client and errors if any are raised, also sets db patient to p pointer
func (w *PatientWorker) FetchPatientByCode(c *mongo.Client, code string, p *s.Patient) (int, string, error) {
	filter := bson.D{primitive.E{Key: "codigo", Value: code}}

	coll := c.Database("db").Collection("patients")

	if err := coll.FindOne(context.TODO(), filter).Decode(p); err != nil {
		return http.StatusNotFound, fmt.Sprintf("Couldn't find the patient with code %v", code), err
	}

	return http.StatusOK, "", nil
}
