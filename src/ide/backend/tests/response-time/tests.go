package main

import (
	u "Inteli-College/2024-1B-T05-CC08-G03/tests/utils"
	"flag"
	"fmt"
)

func main() {
    var testNumber *int = flag.Int("testNumber", 0, "Number of the test to run")
    var repeat *int = flag.Int("repeat", 1000, "Number of requests to make")
    flag.Parse()

    var times []int64;
    ch := make(chan u.SafeReturnInt)

    switch *testNumber {
    case 0:
        var timeSum int64
        for i := 0; i < *repeat; i++ {
            go u.GetAsync("http://localhost:3000/", ch)
            res := <- ch
            if res.Ok() {
                times = append(times, res.Int)
                timeSum += res.Int
            } else {
                fmt.Println(res.Error)
            }
        }
        fmt.Printf("Mean time: %vμs", timeSum / int64(*repeat))
    case 1:
        var timeSum int64
        for i := 0; i < *repeat; i++ {
            go u.PostAsync("http://localhost:3000/api/lexico", "input/test.txt", ch)
            res := <- ch
            if res.Ok() {
                times = append(times, res.Int)
                timeSum += res.Int
            } else {
                fmt.Println(res.Error)
            }
        }
        fmt.Printf("Mean time: %vμs", timeSum / int64(*repeat))
    }
    p := u.MakeTestLineGraph(times)
    p.Download(fmt.Sprintf("output/test-%v.png", *testNumber))
}

