package main

import (
	"fmt"
	"os"
	"strconv"

	"Inteli-College/2024-1B-T05-CC08-G03/internal/handlers"
	"Inteli-College/2024-1B-T05-CC08-G03/internal/store/db"
	"Inteli-College/2024-1B-T05-CC08-G03/internal/utils"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

// Runs echo server
func main() {
	if err := godotenv.Load(); err != nil {
		utils.GetCustomError().PrintMsg(err)
	}

	port, err := strconv.Atoi(os.Getenv("PORT"))
	if err != nil {
		utils.GetCustomError().PrintMsg(fmt.Errorf("Check if port is not nil\n"))
		return
	}

	if err := db.CreateDbClient(os.Getenv("DATABASE_URI")); err != nil {
		utils.GetCustomError().PrintMsg(err)
	}
	defer db.DisconnectDbClient()

	e := echo.New()
	e.Use(middleware.CORS())
	e.Use(middleware.Logger())
	e.GET("/", handlers.NewIndexHandler().ServeIndexPage)

	gLex := e.Group("/api/lexico")
	gLex.POST("", handlers.NewLexicoHandler().AnalyzeLexically)

	gSin := e.Group("/api/sintatico")
	gSin.POST("", handlers.NewSintaticoHandler().AnalyzeSyntactically)

	gSem := e.Group("/api/semantico")
	gSem.POST("", handlers.NewSemanticoHandler().AnalyzeSemantically)

	gGen := e.Group("/api/gerador")
	gGen.POST("", handlers.NewCodeGenHandler().GenerateCode)

	gDb := e.Group("/api/db")
	gDb.GET("", handlers.NewDbHandler().Ping)
	gDb.GET("/patient", handlers.NewDbHandler().FetchPatients)
	gDb.GET("/patient/find", handlers.NewDbHandler().FetchPatientByCode)
	gDb.POST("/patient", handlers.NewDbHandler().CreatePatient)

	if !utils.IsPortAvailable(port) {
		utils.GetCustomError().PrintMsg(fmt.Errorf("Port %v is already in use", port))
		return
	}

	fmt.Println("    ________  _________    ____  ____  _____    ____  ________    ____     ___   _  __  __\n   / ____/ / / /  _/   |  / __ \\/ __ \\/ ___/   / __ \\/ ____/ /   / __ \\   /   | | |/ /_/_/ \n  / / __/ / / // // /| | / / / / / / /\\__ \\   / /_/ / __/ / /   / / / /  / /| | |   // __/\n / /_/ / /_/ // // ___ |/ /_/ / /_/ /___/ /  / ____/ /___/ /___/ /_/ /  / ___ |/   |/ _/  \n \\____/\\____/___/_/  |_/_____/\\____//____/  /_/   /_____/_____/\\____/  /_/  |_/_/|_/___/  ")
	e.Start(fmt.Sprintf(":%v", port))
}
