var express = require('express')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var app = express()
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  next();
});

app.get('/',function (req, res, next) {
  console.log('test')
  res.send('Hello World')
})
app.get('/get',function (req, res, next) {
  res.send('get World')
})

app.post('/post', function (req, res) {
  res.send('Got a POST request')
})
app.post('/upload', upload.any(), function (req, res, next) {
  res.json({code:1, msg:'成功!'});
})
app.listen(3000)
console.log('开始🚀')