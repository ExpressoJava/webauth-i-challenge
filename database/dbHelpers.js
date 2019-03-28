const db = require('./dbConfig.js')

// refactoring knex logic
module.exports = {
  
  insert: (user) => {
    return db('users').insert(user)
  },

  findByUsername: (username) => {
    return db('users').where('username', username)
  },

  find: () => db('users').select('id', 'username', 'password'),

  findBy: (filter) => {
    return db('users').where(filter);
  }
  
};