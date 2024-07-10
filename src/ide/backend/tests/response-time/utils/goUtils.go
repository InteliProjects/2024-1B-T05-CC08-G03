package utils

import (
	"bytes"
	"fmt"
	"image/color"
	"net/http"
	"os"
	"time"

	"gonum.org/v1/plot"
	"gonum.org/v1/plot/plotter"
	"gonum.org/v1/plot/vg"
)

func MakeTestLineGraph(yElements []int64) SafeReturnPlot {
    p := plot.New()

    points := make(plotter.XYs, len(yElements))
    
    for i, yElement := range yElements {
        points[i].X = float64(i)
        points[i].Y = float64(yElement)
    }

    line, err := plotter.NewLine(points)

    if err != nil {
        return SafeReturnPlot{nil, err}
    }

    line.LineStyle.Width = vg.Points(1)
    line.LineStyle.Color = color.RGBA{R: 0, G: 127, B: 127}

    p.Add(line)
    p.Title.Text = "Teste de tempo de resposta"
    p.X.Label.Text = "Número do teste"
    p.Y.Label.Text = "Tempo de resposta (μs)"

    return SafeReturnPlot{p, err}
}

func GetAsync(url string, ch chan SafeReturnInt) {
    startTime := time.Now()
    res, err := http.Get(url)
    elapsedTime := time.Since(startTime)

    if err != nil || res.Status != "200 OK" {
        ch <- SafeReturnInt{Int: 0, Error: err}
        fmt.Printf("%v | %v", err, res.Status)
        return
    }

    defer res.Body.Close()

    ch <- SafeReturnInt{Int: elapsedTime.Microseconds(), Error: nil}
}

func PostAsync(url string, codeFileName string, ch chan SafeReturnInt) {
    code, err := os.ReadFile(codeFileName)

    if err != nil {
        ch <- SafeReturnInt{Int: 0, Error: err}
        fmt.Println(err)
        return
    }

    startTime := time.Now()
    payload := bytes.NewBufferString(string(code))
    res, err := http.Post(url, "text/plain", payload)
    elapsedTime := time.Since(startTime)


    if err != nil || res.Status != "200 OK" {
        ch <- SafeReturnInt{Int: 0, Error: err}
        fmt.Printf("%v | %v\n", err, res.Status)
        return
    }
    
    defer res.Body.Close()

    ch <- SafeReturnInt{Int: elapsedTime.Microseconds(), Error: nil}
}
