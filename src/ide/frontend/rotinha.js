var express = require('express')
var multer  = require('multer')
var port = 3004;

var app = express()

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './src/app/testP5')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

/*
app.use('/a',express.static('/b'));
Above line would serve all files/folders inside of the 'b' directory
And make them accessible through http://localhost:3000/a.
*/
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

app.post('/profile-upload-single', upload.single('profile-file'), function (req, res, next) {
    console.log(JSON.stringify(req.file))
    var response = '<a href="/">Home</a><br>'
    response += "Files uploaded successfully.<br>"
    response += `<img src="${req.file.path}" /><br>`
    return res.send(response)
  })
  
app.post('/profile-upload-multiple', upload.array('profile-files', 12), function (req, res, next) {
    var response = '<a href="/">Home</a><br>'
    response += "Files uploaded successfully.<br>"
    for(var i=0;i<req.files.length;i++){
        response += `<img src="${req.files[i].path}" /><br>`
    }
    
    return res.send(response)
})
   

app.listen(port,() => console.log("localhost:" +port))