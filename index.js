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

// register and add user
server.post('/api/register', (req, res) => {
   const user = req.body
   db('users').insert(user)
   .then(ids => {
     res.status(201).json({id: ids[0]})
   })
   .catch(error => {
     res.status(500).send(error)
   })

})

// login
server.post('/api/login', (req, res) => {
  const bodyUser = req.body;
  db('users').where('username', bodyUser.username)
  .then(users => {
    if (users.length && bodyUser.password === users[0].password) {
      res.json({info: "correct"})
    } else {
      res.status(404).json({error: "Invalid username or password"})
    }
  })
  .catch(error => {
    res.status(500).send(error)
  })
})

const port = process.env.PORT || 7000
server.listen(port, () => console.log(`Server is running on port ${port}`))