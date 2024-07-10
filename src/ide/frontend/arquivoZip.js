const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');
const port = 3003;

const app = express();

// Configuração do multer para salvar o arquivo em um diretório temporário
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/app');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

app.use(express.static(__dirname + '/public'));

// Endpoint para upload do arquivo ZIP
app.post('/upload-zip', upload.single('zip-file'), function (req, res, next) {
  console.log(JSON.stringify(req.file));
  
  const zipPath = req.file.path;
  const extractPath = './src/app';

  try {
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);
    
    // Remove o arquivo ZIP após extração
    fs.unlinkSync(zipPath);

    res.send({
      message: 'Files extracted and uploaded successfully.',
      extractPath: extractPath
    });
  } catch (err) {
    console.error('Error extracting ZIP file:', err);
    res.status(500).send('Error extracting ZIP file.');
  }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
