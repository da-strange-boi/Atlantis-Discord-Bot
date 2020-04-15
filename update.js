const client = require('mongodb').MongoClient
client.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, async (err, db) => {
  if (err) throw err

  const userdata = db.db("atlantis").collection("userdata")

  await userdata.find({}).toArray(async(err, user) => {
    if (err) throw err

    let counter = 0
    user.forEach(async us => {
      if (!us.drop) {
        await userdata.findOneAndUpdate({ userID: us.userID }, {$set: {"drop":false}})
      }
      counter++
      if (counter == user.length) {
        process.exit()
      }
    })
  })
})