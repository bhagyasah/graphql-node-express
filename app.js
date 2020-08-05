const express = require('express');
const bodyParsor = require('body-parser');

const app = express();
app.use(bodyParsor.json());

app.get('/', (req, res) => {
  res.send('Hello world !');
})

app.listen(3000);
