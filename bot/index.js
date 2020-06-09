const Eris = require('eris')
const fs = require('fs')
const config = require('../config.json')

const bot = new Eris.CommandClient(config.BOT_TOKEN, {
  disableEveryone: true,
  defaultImageFormat: 'png',
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
  ignoreBots: false,
  ignoreSelf: true,
  prefix: ['a!', '@mention']
})

// database connection
require('./handlers/database.js')(bot)
bot.color = {
  green: 0x00FF00,
  red: 0xFF0000
}
bot.customOwoPrefix = {}
bot.admins = config.BOT_ADMINS
bot.emojis = require('./handlers/emojis')
bot.log = require('./handlers/logging')
require('./handlers/functions')(bot)

const init = async () => {
  // Load Events
  fs.readdir('./bot/events/', (err, files) => {
    if (err) bot.log('error', err)
    files.forEach(file => {
      const eventFunction = require(`./events/${file}`)
      const eventName = file.split('.')[0]
      bot.on(eventName, (...args) => eventFunction.run(bot, ...args))
    })
  })
  // load commands
  const loader = require('./commands/loader.js')
  loader.run(bot)
}
init()
