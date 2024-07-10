package handlers

import (
	"context"
	"net/http"

	s "Inteli-College/2024-1B-T05-CC08-G03/internal/store"
	"Inteli-College/2024-1B-T05-CC08-G03/internal/store/db"
	u "Inteli-College/2024-1B-T05-CC08-G03/internal/utils"

	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/mongo"
)

// Type to handle mongo db interactions
type DbHandler struct {
	client *mongo.Client
}

// Returns new DbHandler object
func NewDbHandler() *DbHandler {
	return &DbHandler{client: nil}
}

// Set new client to DbHandler
func (h *DbHandler) setClient() error {
	var client mongo.Client
	if err := db.GetDbClient(&client); err != nil {
		return err
	}
	h.client = &client
	return nil
}

// Ping database to see if it's working
func (h *DbHandler) Ping(c echo.Context) error {
	if err := h.setClient(); err != nil || h.client == nil {
		return c.String(http.StatusInternalServerError, "Error when connecting to database\n")
	}

	if err := h.client.Ping(context.TODO(), nil); err != nil {
		return c.String(http.StatusInternalServerError, "Error when connecting to database\n")
	}

	return c.String(http.StatusOK, "Database pinged successfully\n")
}

// Create the terapist's patient
func (h *DbHandler) CreatePatient(c echo.Context) error {
	if err := h.setClient(); err != nil || h.client == nil {
		return c.String(http.StatusInternalServerError, "Error when connecting to database\n")
	}

	var patient s.Patient
	if err := c.Bind(&patient); err != nil {
		u.GetCustomError().PrintMsg(err)
		return c.String(http.StatusBadRequest, "Couldn't parse input\n")
	}

	if statusCode, msg, err := u.NewDbWorker().CreatePatient(h.client, &patient); err != nil {
		u.GetCustomError().PrintMsg(err)
		return c.String(statusCode, msg)
	} else {
		return c.String(statusCode, msg)
	}
}

// Returns the terapist's patients
func (h *DbHandler) FetchPatients(c echo.Context) error {
	if err := h.setClient(); err != nil || h.client == nil {
		return c.String(http.StatusInternalServerError, "Error when connecting to database\n")
	}

	var patients []s.Patient
	if statusCode, msg, err := u.NewDbWorker().FetchPatients(h.client, &patients); err != nil {
		u.GetCustomError().PrintMsg(err)
		return c.String(statusCode, msg)
	} else {
		return c.JSON(statusCode, patients)
	}
}

// Returns the terapist's patients by the code provided as a query param
func (h *DbHandler) FetchPatientByCode(c echo.Context) error {
	if err := h.setClient(); err != nil || h.client == nil {
		return c.String(http.StatusInternalServerError, "Error when connecting to database\n")
	}

	code := c.QueryParam("codigo")

	if code == "" {
		return c.String(http.StatusBadRequest, u.NilQueryParamMsg("codigo"))
	}

	var patient s.Patient
	if statusCode, msg, err := u.NewDbWorker().FetchPatientByCode(h.client, code, &patient); err != nil {
		u.GetCustomError().PrintMsg(err)
		return c.String(statusCode, msg)
	} else {
		return c.JSON(statusCode, patient)
	}
}
