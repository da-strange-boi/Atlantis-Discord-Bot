const Eris = require('eris')
const fs = require('fs')
const redis = require('redis')
const util = require('util')
require('dotenv').config({ path: '.env' })
const bot = new Eris.CommandClient(process.env.TOKEN, {
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
  description: 'A Discord bot made for the OwO bot community, Atlantis',
  ignoreBots: false,
  ignoreSelf: true,
  owner: 'da-strange-boi',
  prefix: ['a!', '@mention']
})

bot.keys = {
  mongodb: 'mongodb://localhost:27017',
  redis: ''
}
// database connection
require('./handlers/database.js')(bot)
bot.color = {
  green: 0x00FF00,
  red: 0xFF0000
}
bot.botBannedUsers = []
bot.customOwoPrefix = {}
bot.admins = ['295255543596187650', '494540660943224844']
bot.emojis = require('./handlers/emojis')
bot.log = require('./handlers/logging')
bot.utilData = require('./handlers/utilData')
if (process.env.DEV === 'false') require('./website/app').run(bot)
bot.redis = redis.createClient(bot.keys.redis)
bot.redis.hget = util.promisify(bot.redis.hget)
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

/*
  I am not a good programmer so please don't die looking at this (probably) bad code
*/
