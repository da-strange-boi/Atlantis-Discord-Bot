const client = require('mongodb').MongoClient
client.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, async (err, db) => {
  if (err) throw err

  const guilddata = db.db("atlantis").collection("guilddata")

  await guilddata.find({}).toArray(async(err, guild) => {
    if (err) throw err

    let counter = 0
    guild.forEach(async gu => {
      if (!gu.prefix) {
        await guilddata.findOneAndUpdate({ guildID: gu.guildID }, {$set: {"prefix":""}})
      }
      counter++
      if (counter == guild.length) {
        process.exit()
      }
    })
  })
})