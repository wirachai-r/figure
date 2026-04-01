const express = require("express");
const app = express();
const morgan = require('morgan')
const { readdirSync } = require('fs')
const cors = require('cors')

app.use(morgan('dev'))
app.use(express.json({ limit: '20mb' }))
app.use(cors())
app.use('/img', express.static('uploads'))

readdirSync('./routes').map((item) => app.use('/api', require('./routes/' + item)))

app.listen(3001, () => {
  console.log("Yey, your server is running on port 3001");
});