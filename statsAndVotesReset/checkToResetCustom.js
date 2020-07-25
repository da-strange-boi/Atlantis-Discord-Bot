// check last vote
const hours12 = 43200000
const client = require('mongodb').MongoClient
let voteCheckCounterDone = false
client.connect('mongodb://localhost:27017', { useUnifiedTopology: true }, async (err, db) => {
  if (err) throw err

  const userdata = db.db('atlantis').collection('userdata')

  await userdata.find({}).toArray((err, users) => {
    if (err) console.log(err)

    let voteCheckCounter = 0
    users.forEach(async user => {
      if ((Date.now() - user.lastVote) >= hours12) {
        const modifiedCustom = user.customs
        for (let i = 0; i < modifiedCustom.length; i++) {
          if (modifiedCustom[i].id !== 1) modifiedCustom[i].unlocked = false
        }
        await userdata.findOneAndUpdate({ userID: user.userID }, { $set: { customs: modifiedCustom } })
      }

      voteCheckCounter++
      if (voteCheckCounter === users.length) {
        voteCheckCounterDone = true
      }
    })
  })

  setInterval(() => {
    if (voteCheckCounterDone) {
      process.exit(1)
    }
  }, 60000)
})
