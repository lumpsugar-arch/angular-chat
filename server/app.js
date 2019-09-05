const express = require('express'),
      path = require('path'),
      apiRoute = require('./routes/api'),
      bodyParser = require('body-parser');

const app = express(),
      port = process.env.PORT || 5000,
      clientPath = path.join(__dirname, '../client/src');


app.use(bodyParser.json());
app.use('/api', apiRoute);
app.use(express.static(clientPath));
app.get('*', (req, res) => {
  res.sendFile(clientPath);
});

// app.get('/', (req, res) => {
//   res.render('index')
// });

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


