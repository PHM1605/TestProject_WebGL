import express from 'express';

var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
  // Edit here to choose which program
  res.sendFile('index.html', {root: 'public/Chapter3'});
});
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
