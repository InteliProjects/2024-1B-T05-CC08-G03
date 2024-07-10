package utils

import (
	"fmt"

	"gonum.org/v1/plot"
	"gonum.org/v1/plot/vg"
)

type SafeReturn interface {
    Ok() bool
}

type SafeReturnInt struct {
    Int     int64
    Error   error
}

type SafeReturnTimeAndMean struct {
    Int     int64
    Mean    int64
    Error   error
}

type SafeReturnPlot struct {
    Plot    *plot.Plot
    Error   error
}

func (s* SafeReturnInt) Ok() bool {
    return s.Error == nil
}

func (s* SafeReturnPlot) Ok() bool {
    return s.Error == nil
}

func (s* SafeReturnPlot) Download(name string) {
    if !s.Ok() {
        fmt.Println(s.Error)
        return
    }
    s.Plot.Save(10*vg.Inch, 10*vg.Inch, name);
}
