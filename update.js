const client = require('mongodb').MongoClient
client.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, async (err, db) => {
  if (err) throw err

  const guilddata = db.db("atlantis").collection("guilddata")

  await guilddata.find({}).toArray(async(err, guilds) => {
    if (err) throw err

    let counter = 0
    guilds.forEach(async guild => {

      // update owoPrefix
      if (!guild.owoPrefix) {
        await guilddata.findOneAndUpdate({ guildID: guild.guildID }, {$set: {"owoPrefix":null}})
      }

      counter++
      if (counter == guilds.length) {
        process.exit()
      }
    })
  })
})