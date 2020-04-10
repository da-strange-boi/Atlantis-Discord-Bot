// Hey maxi im watching you 👀
const assert = require('assert')
const client = require('mongodb').MongoClient

let _db

function initDb(callback) {
  if (_db) {
    console.warn('trying to init DB again!')
    return callback(null, _db)
  }
  client.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, connected)

  function connected(err, db) {
    if (err) {
      return callback(err)
    }
    _db = db
    return callback(null, _db)
  }
}

function getDb() {
  assert.ok(_db, 'Db has not been initialized. Please called init first.')
  return _db
}

module.exports = {
  getDb,
  initDb
}
