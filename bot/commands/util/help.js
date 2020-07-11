exports.run = async (bot) => {
  bot.registerCommand('help', async (message, args) => {
    await bot.checkUserAndGuild(message)
    if (bot.checkBannedUsers(message.author.id)) return

    const commandDetails = (name, usage, description, example = false, aliases = false) => {
      const detailEmbed = {
        embed: {
          title: name,
          description: description,
          color: bot.getEmbedColor(bot, message),
          fields: [
            {
              name: 'Usage',
              value: usage
            }
          ],
          timestamp: new Date()
        }
      }
      if (example) {
        detailEmbed.embed.fields.push({
          name: 'Example',
          value: example
        })
      }
      if (aliases) {
        detailEmbed.embed.fields.push({
          name: 'Aliases',
          value: aliases
        })
      }
      return detailEmbed
    }

    if (!args[0] || args[0] === 'admin') {
      const helpEmbed = {
        embed: {
          title: `Atlantis Help ${bot.emojis.native.trident}`,
          color: bot.getEmbedColor(bot, message),
          description: `Join **Atlantis Support Server** ${bot.emojis.atlantisPfp} **[here](https://discord.gg/w7Sk8hC)**\nThis is the full command list for **${bot.user.username}**! For more info on what a command does do \`a!help <command name>\`\nThanks to \`pri8000#8266\` for the profile picture art!`,
          fields: [
            {
              name: 'General',
              value: '`hunt`, `battle`, `drop` `owo`, `praycurse`, `huntbot`, `show`'
            },
            {
              name: 'Util',
              value: '`support`, `custom`, `help`, `invite`, `stats`, `status`, `serverstats`, `ping`, `vote`, `zoostats`'
            },
            {
              name: 'Admin',
              value: '`deluser`, `delbot`, `delete`, `owochannel`, `owoprefix`, `prefix`'
            }
          ],
          footer: {
            text: 'Atlantis Bot, made by `da strange boi#7087` with lots of love!'
          },
          timestamp: new Date()
        }
      }

      if (bot.admins.includes(message.author.id) && args[0] === 'admin') {
        helpEmbed.embed.fields.push({ name: 'Bot Admin', value: '`botban`, `eval`' })
      }

      bot.createMessage(message.channel.id, helpEmbed)
    }
    if (args[0]) {
      if (args[0].toLowerCase() === 'admin') return
      // User wants more detail on command (a!help hunt)
      let commandDetailToSend
      switch (args[0].toLowerCase()) {
        case 'hunt': commandDetailToSend = commandDetails('Hunt', '`a!hunt`', 'Toggles the reminder for `owo hunt`', false, '`h`, `catch`'); break
        case 'battle': commandDetailToSend = commandDetails('Battle', '`a!battle`', 'Toggles the reminder for `owo battle`', false, '`b`, `fight`'); break
        case 'owo': commandDetailToSend = commandDetails('OwO', '`a!owo`', 'Toggles the reminder for `owo`'); break
        case 'drop': commandDetailToSend = commandDetails('Drop', '`a!drop`', 'Toggles the reminder for `owo drop`'); break
        case 'praycurse': commandDetailToSend = commandDetails('Praycuse', '`a!praycurse`', 'Toggles the reminder for `owo pray` & `owo curse`', false, '`pray`, `curse`'); break
        case 'huntbot': commandDetailToSend = commandDetails('Huntbot', '`a!huntbot`', 'Toggles the reminder for `owo huntbot`', false, '`huntbot`'); break
        case 'show': commandDetailToSend = commandDetails('Show', '`a!show`', 'Shows what is enabled/disabled'); break
        case 'custom': commandDetailToSend = commandDetails('Custom', '`a!custom set <trigger check> <time> <trigger phrase>`\n`a!custom delete <1|2|3>`', `To set and delete custom timers\n**<trigger check>** ~ b, a, e\n${bot.emojis.blank} **b** - checks for the trigger phrase in the beginning of the message\n${bot.emojis.blank} **a** - checks for the trigger phrase anywhere in the message (space padded)\n${bot.emojis.blank} **e** - checks for the trigger phrase at the end of the message\n**<time>** - the time it should wait until it reminds you\n${bot.emojis.blank} in the format \`1M30S\`\n**<trigger phrase>** - the text to look for in the message to remind you`, '`a!custom set b 15S owo slots`\n`a!custom delete 2`'); break
        case 'invite': commandDetailToSend = commandDetails('Invite', '`a!invite`', 'Invite Atlantis bot to your server'); break
        case 'deluser': commandDetailToSend = commandDetails('Deluser', '`a!deluser add/delete <#channel mention>`', 'Deletes user messages in a given channel', '`a!deluser add #general`'); break
        case 'delbot': commandDetailToSend = commandDetails('Delbot', '`a!delbot add/delete <#channel mention>`', 'Deletes bot messages in a given channel', '`a!delbot delete #owo`'); break
        case 'delete': commandDetailToSend = commandDetails('Delete', '`a!delete add/delete <prefix word> <#channel mention>`', 'Deletes all messages that match the given channel and message prefix', '`a!delete add bot_command #channel`'); break
        case 'owochannel': commandDetailToSend = commandDetails('OwO Channel', '`a!owochannel add/delete <#channel mention>`', 'Deletes all messages except "owo"', '`a!owochannel add #owo`'); break
        case 'prefix': commandDetailToSend = commandDetails('Prefix', '`a!prefix [new prefix]`', "Change the server's bot prefix", '`a!prefix atl{space}`\n**{space}** - inserts a space'); break
        case 'owoprefix': commandDetailToSend = commandDetails('OwO Prefix', '`a!owoprefix [new prefix]`', 'Adds a custom OwO prefix', '`a!owoprefix uwu`\n**{space}** - inserts a space'); break
        case 'botban': commandDetailToSend = commandDetails('Botban', '`a!botban <user id> <reason>`', '`a!botban 295255543596187650 for testing`'); break
        case 'stats': commandDetailToSend = commandDetails('Stats', '`a!stats [@mention]`', 'Show your OwO stats', null, '`s`'); break
        case 'status': commandDetailToSend = commandDetails('Status', '`a!status`', 'Displays bot information'); break
        case 'vote': commandDetailToSend = commandDetails('Vote', '`a!vote`', 'To vote for Atlantis on top.gg'); break
        case 'serverstats': commandDetailToSend = commandDetails('Serverstats', '`a!serverstats [@mention | user id]`', 'To see a users server stats', false, '`ss`'); break
        case 'zoostats': commandDetailToSend = commandDetails('Zoostats', '`a!zoostats {list of zoo message ID\'s}`', 'Figure out how much your zoo will give cowoncy or essence\n- must be ran in the same channel the message ids were sent', '`a!zoostats 727554593449312308 727554594401681422`'); break
        case 'support': commandDetailToSend = commandDetails('Support', '`a!support`', 'Sends the link to join the Atlantis Support Server'); break
        case 'ping': commandDetailToSend = commandDetails('Ping', '`a!ping`', 'Gets the ping of the bot'); break
        default: commandDetailToSend = { embed: { title: 'Error', color: bot.color.red, description: 'You have to add specify a command name', timestamp: new Date() } }; break
      }
      bot.createMessage(message.channel.id, commandDetailToSend)
    }
  }, {
    cooldown: 3000,
    cooldownMessage: 'Whoa there slow down, the cooldown is 3 seconds!'
  })
}
