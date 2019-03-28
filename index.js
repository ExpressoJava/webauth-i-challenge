const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const session = require('express-session')

const db = require('./database/dbConfig')
const dbHelpers = require('./database/dbHelpers')

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
   user.password = bcrypt.hashSync(user.password, 16) // default is at 10 string (n *2)
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
  // check that username exists AND that passwords match
  const bodyUser = req.body;
  db('users').where('username', bodyUser.username)
  .then(users => {
    
    //console.log('body user', bodyUser); // comparing bodyuser with hashed database user
   // console.log('database user', users[0])
    // username valid    hash from client == hash from db
    if (users.length && bcrypt.compareSync(bodyUser.password, users[0].password)) {
      res.json({info: "correct"})
    } else {
      res.status(404).json({error: "Invalid username or password"})
    }
  })
  .catch(error => {
    res.status(500).send(error)
  })
})


// restricted to authorized user only

function restricted(req, res, next) {
  const { username, password } = req.headers;

  if (username && password) {

  dbHelpers.findBy({ username })
    .first()
    .then(user => {
       // step: check if password match

      if (user && bcrypt.compareSync(password, user.password)) {
      next();
       
      } else {
        res.status(401).json({ message: 'Invalid credentials: You shall not pass!' });
      }
    })
    .catch(error => {
      res.status(400).json({message: 'No credentials provided'});
    });
    } else {
  res.status(401).json({message: 'No credentials provided'});
    }
}

function protected(req, res, next){
	if (req.session && req.session.username){
		next();
	} else {
		res.status(401).json({ message: 'Please login.' });
  }
}

// protect his route, only authorized user should see it
server.get('/api/users', restricted, (req, res) => {
  dbHelpers.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

const port = process.env.PORT || 7000
server.listen(port, () => console.log(`Server is running on port ${port}`))
