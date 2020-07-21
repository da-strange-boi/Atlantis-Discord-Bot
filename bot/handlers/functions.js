const _ = require('lodash')
module.exports = async (bot) => {
  /** @typedef {function} bot.checkPermission
   * Checks the permission of the user within the bot
   * @param {Eris.message} message Eris message class
   * @param {String} typeOfPermission "botAdmin" | "botOwner"
   * @returns {Boolean} If true it has that permission
   */
  bot.checkPermission = async (message, typeOfPermission) => {
    let hasPermission
    switch (typeOfPermission) {
      case 'botAdmin': bot.admins.includes(message.author.id) ? hasPermission = true : hasPermission = false; break
      case 'botOwner': message.author.id === '295255543596187650' ? hasPermission = true : hasPermission = false; break
      default: return new TypeError("Invalid 'typeOfPermission' type")
    }
    return hasPermission
  }

  /** @typedef {function} bot.checkAndUpdateCategories
   * Update any deleted channels for admin commands
   * @param {Eris.message} msg Eris message class
   * @param {String} category The category type for the admin command
   * @param {String} channelID The channel id
   * @param {MongoDB.Collection} guilddata The guilddata document
   */
  bot.checkAndUpdateCategories = (msg, category, channelID, guilddata) => {
    const updatedList = guilddata[category]
    _.remove(updatedList, function (n) {
      return n === channelID
    })
    return bot.database.Guilddata.findOneAndUpdate({ guildID: msg.member.guild.id }, { $set: { [category]: updatedList } })
  }

  /** @typedef {function} bot.checkUserAndGuild
   * To update any user/guild objects that are out-dated or create new
   * @param {Eris.message} message Eris message class
   */
  bot.checkUserAndGuild = async (message) => {
    if (message.author.bot) return
    await bot.database.Userdata.findOne({ userID: message.author.id }, async (err, userdata) => {
      if (err) bot.log('error', err)
      if (!userdata) {
        await bot.database.Userdata.insertOne({
          userID: message.author.id,
          lastVote: 0,
          hunt: true,
          battle: false,
          drop: false,
          owo: false,
          praycurse: true,
          huntbot: true,
          stats: {
            owoCount: 0,
            huntCount: 0,
            battleCount: 0,
            praycurseCount: 0,
            completedHuntbots: 0,
            totalHuntbotTime: 0,
            dailyOwoCount: 0,
            dailyHuntCount: 0,
            dailyBattleCount: 0,
            dailyPraycurseCount: 0,
            guilds: {}
          },
          customs: [
            {
              id: 1,
              unlocked: true,
              trigger: '',
              triggerText: '',
              time: 0,
              displayTime: ''
            },
            {
              id: 2,
              unlocked: false,
              trigger: '',
              triggerText: '',
              time: 0,
              displayTime: ''
            },
            {
              id: 3,
              unlocked: false,
              trigger: '',
              triggerText: '',
              time: 0,
              displayTime: ''
            }
          ]
        })
      }
    })
    await bot.database.Guilddata.findOne({ guildID: message.channel.guild.id }, async (err, guilddata) => {
      if (err) bot.log('error', err)
      if (!guilddata) {
        await bot.database.Guilddata.insertOne({
          guildID: message.member.guild.id,
          prefix: '',
          deleteUserMessagesChannels: [],
          deleteBotMessagesChannels: [],
          owoChannel: [],
          delete: []
        })
      }
    })
  }

  /** @typedef {function} getEmbedColor
   * Gets the embed color depending on the bots roles
   * @param {Eris.CommandClient} bot The Eris Client
   * @param {Eris.message} message The Eris Message Class
   * @returns {number} base 10 of color
  */
  bot.getEmbedColor = (bot, message) => {
    const comparePositions = (role1, role2) => {
      if (role1.position === role2.position) return role2.id - role1.id
      return role1.position - role2.position
    }

    const memberRoleObjects = []
    message.member.guild.roles.forEach(guildRole => {
      message.member.guild.members.get(bot.user.id).roles.forEach(memberRole => {
        if (guildRole.id === memberRole) {
          memberRoleObjects.push(guildRole)
        }
      })
    })

    const coloredRoles = memberRoleObjects.filter(role => role.color)
    if (coloredRoles.length === 0) return 0xd4af37
    const color = coloredRoles.reduce((prev, role) => (!prev || comparePositions(role, prev) > 0 ? role : prev))
    return color.color
  }

  /** @typedef {function} checkBannedUsers
   * Checks to see if the given user id is bot banned
   * @param {String} id The user id
   * @returns {Boolean} If the user is bot banned or not
   */
  bot.checkBannedUsers = (id) => {
    if (bot.botBannedUsers.includes(id)) {
      return true
    } else {
      return false
    }
  }

  // doesn't currently work
  bot.checkBotPermission = async (message, permissionsReq = []) => {
    const permissions = await message.channel.permissionsOf(bot.user.id)
    const allowedPermissions = []
    for (let i = 0; i < permissionsReq.length; i++) {
      await permissions.has(permissionsReq[i]) ? allowedPermissions.push(1) : allowedPermissions.push(0)
    }
    return !allowedPermissions.includes(0)
  }

  bot.getUser = async (message, input) => {
    const mention = input.match(/^<@!?[0-9]{17,21}>$/)
    if (mention) input = input.match(/\d+/)[0]

    await message.channel.guild.fetchAllMembers()
    const members = []

    await message.channel.guild.members.forEach(member => members.push(member))

    for (const value of members) {
      if (input === value.id) return value
    }

    for (const type of ['username', 'nick']) {
      for (const value of members) {
        if (value[type] && input === value[type]) return value.user
      }
      for (const value of members) {
        if (value[type] && input.toLowerCase() === value[type].toLowerCase()) return value.user
      }
      for (const value of members) {
        if (value[type] && value[type].startsWith(input)) return value.user
      }
      for (const value of members) {
        if (value[type] && value[type].toLowerCase().startsWith(input.toLowerCase())) return value.user
      }
      for (const value of members) {
        if (value[type] && value[type].includes(input)) return value.user
      }
      for (const value of members) {
        if (value[type] && value[type].toLowerCase().includes(input.toLowerCase())) return value.user
      }
    }

    return message.author
  }

  bot.getUserdata = async (userID) => {
    const userdata = await bot.redis.hget('userdata', userID)

    if (!userdata) {
      await bot.database.Userdata.findOne({ userID: userID }, async (err, userdataFromDB) => {
        if (err) bot.log('error', err)

        if (userdataFromDB) {
          bot.redis.hset('userdata', userID, JSON.stringify(userdataFromDB))
          return userdataFromDB
        }
      })
    }

    if (userdata) {
      return JSON.parse(userdata)
    }
  }

  bot.updateUserdata = async (key, value, userID, userdata) => {
    const oldUserdata = userdata
    oldUserdata[key] = value
    await bot.database.Userdata.findOneAndUpdate({ userID: userID }, { $set: { [key]: value } })
    bot.redis.hset('userdata', userID, JSON.stringify(oldUserdata))
  }

  bot.updateUserdataStats = async (key, userID, userdata, guildID = false) => {
    const dailyKey = `daily${key[0].toUpperCase() + key.slice(1)}`
    if (guildID) {
      userdata.stats.guilds[guildID][key] += 1
      userdata.stats.guilds[guildID][dailyKey] += 1
      await bot.database.Userdata.findOneAndUpdate({ userID: userID }, { $set: { [`stats.guilds.${guildID}.${key}`]: userdata.stats.guilds[guildID][key] } })
      await bot.database.Userdata.findOneAndUpdate({ userID: userID }, { $set: { [`stats.guilds.${guildID}.${dailyKey}`]: userdata.stats.guilds[guildID][dailyKey] } })
      bot.redis.hset('userdata', userID, JSON.stringify(userdata))
    } else {
      userdata.stats[key] += 1
      userdata.stats[dailyKey] += 1
      await bot.database.Userdata.findOneAndUpdate({ userID: userID }, { $set: { [`stats.${key}`]: userdata.stats[key] } })
      await bot.database.Userdata.findOneAndUpdate({ userID: userID }, { $set: { [`stats.${dailyKey}`]: userdata.stats[dailyKey] } })
      bot.redis.hset('userdata', userID, JSON.stringify(userdata))
    }
  }
}
