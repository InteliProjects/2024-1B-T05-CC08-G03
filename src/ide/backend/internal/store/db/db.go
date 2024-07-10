package db

import (
	"context"
	"fmt"
	"os"

	"Inteli-College/2024-1B-T05-CC08-G03/internal/utils"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Variable that stores the database client as a singleton
var dbClient *mongo.Client

// Returns error when any raised, lazily sets mongo client to pDbClient pointer.
func GetDbClient(pDbClient *mongo.Client) error {
	if dbClient == nil {
		if err := godotenv.Load(); err != nil {
			return err
		}
		if CreateDbClient(os.Getenv("DATABASE_URI")) != nil {
			return fmt.Errorf("Couldn't create database\n")
		}
	}

	*pDbClient = *dbClient
	return nil
}

// Creates db client from the uri provided, returns any raised errors
func CreateDbClient(uri string) error {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))

	if err != nil {
		return fmt.Errorf("%v\n", err)
	}

	dbClient = client
	return nil
}

// Attempts to disconnect the client, returns any raised errors
func DisconnectDbClient() {
	if err := dbClient.Disconnect(context.TODO()); err != nil {
		utils.GetCustomError().PrintMsg(err)
	}
}
