const client = require('mongodb').MongoClient

module.exports = async (bot) => {
  const connected = async (err, db) => {
    if (err) {
      return err
    }

    const client = await db
    const dbObject = {
      db: await client,
      Userdata: await client.db('atlantis').collection('userdata'),
      Guilddata: await client.db('atlantis').collection('guilddata'),
      HuntBot: await client.db('atlantis').collection('huntbot'),
      BotBan: await client.db('atlantis').collection('botban'),
      Website: await client.db('atlantis').collection('website')
    }
    bot.database = dbObject
    bot.log('dbConnected')

    // Once DB is connected, connect the bot
    bot.connect()
  }

  client.connect('mongodb://localhost:27017', { useUnifiedTopology: true }, connected)
}
