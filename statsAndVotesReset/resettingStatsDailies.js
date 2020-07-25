const client = require('mongodb').MongoClient
let dssCounterDone = false
client.connect('mongodb://localhost:27017', { useUnifiedTopology: true }, async (err, db) => {
  if (err) throw err

  const userdata = db.db('atlantis').collection('userdata')

  // Delete daily stats
  userdata.updateMany({}, {
    $set: {
      'stats.dailyOwoCount': 0,
      'stats.dailyHuntCount': 0,
      'stats.dailyBattleCount': 0,
      'stats.dailyPraycurseCount': 0
    }
  })

  // Delete server stats
  let dssCounter = 0
  userdata.find({}).toArray((err, users) => {
    if (err) console.error(err)

    users.forEach(user => {
      if (Object.keys(user.stats.guilds).length !== 0) {
        Object.keys(user.stats.guilds).forEach(async (guildStats) => {
          await userdata.findOneAndUpdate({ userID: user.userID }, {
            $set: {
              [`stats.guilds.${guildStats}.dailyOwoCount`]: 0,
              [`stats.guilds.${guildStats}.dailyHuntCount`]: 0,
              [`stats.guilds.${guildStats}.dailyBattleCount`]: 0,
              [`stats.guilds.${guildStats}.dailyPraycurseCount`]: 0
            }
          })
        })
      }

      dssCounter++
      if (dssCounter === users.length) {
        dssCounterDone = true
      }
    })
  })

  setInterval(() => {
    if (dssCounterDone) {
      process.exit(1)
    }
  }, 60000)
})
