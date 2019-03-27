const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const bcrypt = require('bcryptjs')

const db = require('./database/dbConfig')

const server = express();

server.use(helmet())
server.use(express.json())
server.use(cors())

server.get('/', (req,res) => {
  res.send('Server is alive!')
})

const port = process.env.PORT || 7000
server.listen(port, () => console.log(`Server is running on port ${port}`))