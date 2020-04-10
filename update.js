const client = require('mongodb').MongoClient
client.connect("mongodb://localhost:27017", { useUnifiedTopology: true }, (err, db) => {
  if (err) throw err

  const userdata = db.db("atlantis").collection("userdata")

  await userdata.find({}).toArray((err, user) => {
    if (err) throw err

    user.forEach(us => {
      if (!us.stats) {
        await userdata.findOneAndUpdate({ userID: us.userID }, {$set: {"stats":{owoCount: 0,huntCount: 0,battleCount: 0,praycurseCount: 0,completedHuntbots: 0,totalHuntbotTime: 0,dailyOwoCount: 0,dailyHuntCount: 0,dailyPraycurseCount: 0}}})
      }
    })
  })
})