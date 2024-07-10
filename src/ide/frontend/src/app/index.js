const express = require("express");
const path = require("path");
const app = express();

// Caminho correto para a pasta testP5
const testP5Path = path.join(__dirname, '..', 'app', 'testP5');

app.use(express.static(testP5Path));

app.use(function(_, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Serve o index.html quando acessar a raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(testP5Path, 'index.html'));
});

app.listen(8081, () => console.log("Running on :8081"));
