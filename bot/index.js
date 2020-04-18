/** @type {import("eris")} */
const Eris = require("eris")
const fs = require("fs")
const _ = require("lodash")
require("dotenv").config({path:".env"})
const bot = new Eris.CommandClient(process.env.TOKEN, {
  disableEveryone: true,
  defaultImageFormat: "png",
  restMode: true,
  disableEvents: {
    CHANNEL_DELETE: true,
    CHANNEL_UPDATE: true,
    GUILD_BAN_ADD: true,
    GUILD_BAN_REMOVE: true,
    GUILD_ROLE_CREATE: true,
    GUILD_ROLE_DELETE: true,
    GUILD_ROLE_UPDATE: true,
    MESSAGE_DELETE: true,
    MESSAGE_DELETE_BULK: true,
    PRESENCE_UPDATE: true,
    TYPING_START: true,
    VOICE_STATE_UPDATE: true
  }
}, {
  defaultHelpCommand: false,
  description: "A Discord bot made for the OwO bot community, Atlantis",
  ignoreBots: false,
  ignoreSelf: true,
  owner: "da-strange-boi",
  prefix: ["a!", "@mention"]
})

// database connection
const { initDb, getDb } = require('./handlers/database.js')
initDb((err) => {
  if (err) throw err
})
setTimeout(() => {
  const client = getDb()
  const dbObject = {
    db: client,
    Userdata: client.db("atlantis").collection("userdata"),
    Guilddata: client.db("atlantis").collection("guilddata"),
    HuntBot: client.db("atlantis").collection("huntbot"),
    BotBan: client.db("atlantis").collection("botban")
  }
  bot.database = dbObject
  bot.log("dbConnected")
}, 4000)

bot.color = {
  green: 0x00FF00,
  red: 0xFF0000
}
bot.admins = ["295255543596187650", "494540660943224844", "296155961230622720"]
bot.botBannedUsers = []
bot.emojis = require("./handlers/emojis")
bot.log = require("./handlers/logging")
require("./handlers/functions")(bot)

bot.checkBannedUsers = (id) => {
  if (bot.botBannedUsers.includes(id)) {
    return true
  } else {
    return false
  }
}

const init = async () => {
  // Load Events
  fs.readdir("./bot/events/", (err, files) => {
    if (err) bot.log("error", err)
    files.forEach(file => {
      const eventFunction = require(`./events/${file}`)
      const eventName = file.split(".")[0]
      bot.on(eventName, (...args) => eventFunction.run(bot, ...args))
    })
  })
  // load commands
  const loader = require("./commands/loader.js")
  loader.run(bot)
}
init()

bot.connect()

/*
  I am not a good programmer so please don't die looking at this (probably) bad code
*/