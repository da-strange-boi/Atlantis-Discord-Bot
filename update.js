const client = require('mongodb').MongoClient
client.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, async (err, db) => {
  if (err) throw err

  const userdata = db.db("atlantis").collection("userdata")

  await userdata.find({}).toArray(async(err, user) => {
    if (err) throw err

    let counter = 0
    user.forEach(async us => {

      // update owo
      if (!us.owo) {
        await userdata.findOneAndUpdate({ userID: us.userID }, {$set: {"owo":false}})
      }

      // update stats
      if (!us.stats) {
        await userdata.findOneAndUpdate({ userID: us.userID }, {$set: {"stats":{owoCount: 0,huntCount: 0,battleCount: 0,praycurseCount: 0,completedHuntbots: 0,totalHuntbotTime: 0,dailyOwoCount: 0,dailyHuntCount: 0,dailyPraycurseCount: 0}}})
      }

      // update dailyBattleCount in stats
      if (!us.stats.dailyBattleCount) {
        await userdata.findOneAndUpdate({ userID: us.userID }, {$set: {"stats.dailyBattleCount":0}})
      }

      // update customs
      if (!us.customs) {
        await userdata.findOneAndUpdate({ userID: us.userID }, {$set: {"customs":[
          {
            id: 1,
            unlocked: true,
            name: "Untitled",
            trigger: "",
            triggerText: "",
            time: ""
          },
          {
            id: 2,
            unlocked: false,
            name: "Untitled",
            trigger: "",
            triggerText: "",
            time: ""
          },
          {
            id: 3,
            unlocked: false,
            name: "Untitled",
            trigger: "",
            triggerText: "",
            time: ""
          },
        ]}})
      }
      counter++
      if (counter == user.length) {
        process.exit()
      }
    })
  })
})