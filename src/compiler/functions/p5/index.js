const express = require("express")
const app = express()

app.use(express.static('public'))
app.use(function(_, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(8081, () => console.log("Running in :8081"))
