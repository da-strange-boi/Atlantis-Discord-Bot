/** @type {import("eris")} */
const Eris = require("eris")
const fs = require("fs")
require("dotenv").config({path:".env"})
const bot = new Eris.CommandClient(process.env.TOKEN, {
  disableEveryone: true,
  defaultImageFormat: "png",
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
    HuntBot: client.db("atlantis").collection("huntbot")
  }
  bot.database = dbObject
  bot.log("dbConnected")
}, 4000)

bot.color = {
  green: 0x00FF00,
  red: 0xFF0000
}
bot.admin = "295255543596187650"

bot.checkUserAndGuild = async (message) => {
  await bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
    if (err) bot.log("error", err)
    if (!userdata) {
      await bot.database.Userdata.insertOne({
        userID: message.author.id,
        hunt: true,
        battle: false,
        praycurse: true,
        huntbot: true
      })
    }
  })
  await bot.database.Guilddata.findOne({ guildID: message.member.guild.id }, async (err, guilddata) => {
    if (err) bot.log("error", err)
    if (!guilddata) {
      await bot.database.Guilddata.insertOne({
        guildID: message.member.guild.id,
        deleteUserMessagesChannels: [],
        deleteBotMessagesChannels: [],
        owoChannel: [],
        welcomeChannel: [" ", "Welcome {user} to **{server}**!"]
      })
    }
  })
}

/** @typedef {function} getEmbedColor
 * @returns {number} base 10 of color
*/
bot.getEmbedColor = (bot, message) => {
  const comparePositions = (role1, role2) => {
    if (role1.position === role2.position) return role2.id - role1.id;
    return role1.position - role2.position;
  }

  const memberRoleObjects = []
  message.member.guild.roles.forEach(guildRole => {
    message.member.guild.members.get(bot.user.id).roles.forEach(memberRole => {
      if (guildRole.id == memberRole) {
        memberRoleObjects.push(guildRole)
      }
    })
  })

  const coloredRoles = memberRoleObjects.filter(role => role.color)
  if (coloredRoles.length == 0) return 0xd4af37
  const color = coloredRoles.reduce((prev, role) => (!prev || comparePositions(role, prev) > 0 ? role : prev));
  return color.color
}

bot.log = require("./handlers/logging")

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
  const loader = require("./commands/meta/loader.js")
  loader.run(bot)
}
init()

bot.connect()

/*
  I am not a good programmer so please don't die looking at this (probably) bad code
*/