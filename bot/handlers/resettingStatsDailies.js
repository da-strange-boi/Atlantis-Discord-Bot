const client = require('mongodb').MongoClient
let ddsCounterDone = false
let dssCounterDone = false
client.connect('mongodb://localhost:27017', { useUnifiedTopology: true }, async (err, db) => {
  if (err) throw err

  const userdata = db.db('atlantis').collection('userdata')

  // Delete daily stats
  let ddsCounter = 0
  userdata.find({}).toArray((err, users) => {
    if (err) console.error(err)

    users.forEach(async (user) => {
      await userdata.findOneAndUpdate({ userID: user.userID }, { $set: { 'stats.dailyOwoCount': 0 } })
      await userdata.findOneAndUpdate({ userID: user.userID }, { $set: { 'stats.dailyHuntCount': 0 } })
      await userdata.findOneAndUpdate({ userID: user.userID }, { $set: { 'stats.dailyBattleCount': 0 } })
      await userdata.findOneAndUpdate({ userID: user.userID }, { $set: { 'stats.dailyPraycurseCount': 0 } })

      ddsCounter++
      if (ddsCounter === users.length) {
        ddsCounterDone = true
      }
    })
  })

  // Delete server stats
  let dssCounter = 0
  await userdata.find({}).toArray((err, users) => {
    if (err) console.error(err)

    users.forEach(user => {
      if (Object.keys(user.stats.guilds).length !== 0) {
        Object.keys(user.stats.guilds).forEach(async (guildStats) => {
          await userdata.findOneAndUpdate({ userID: user.userID }, { $set: { [`stats.guilds.${guildStats}.dailyOwoCount`]: 0 } })
          await userdata.findOneAndUpdate({ userID: user.userID }, { $set: { [`stats.guilds.${guildStats}.dailyHuntCount`]: 0 } })
          await userdata.findOneAndUpdate({ userID: user.userID }, { $set: { [`stats.guilds.${guildStats}.dailyBattleCount`]: 0 } })
          await userdata.findOneAndUpdate({ userID: user.userID }, { $set: { [`stats.guilds.${guildStats}.dailyPraycurseCount`]: 0 } })
        })
      }

      dssCounter++
      if (dssCounter === users.length) {
        dssCounterDone = true
      }
    })
  })

  setInterval(() => {
    if (ddsCounterDone && dssCounterDone) {
      process.exit(1)
    }
  }, 60000)
})
