// Hey maxi im watching you 👀
exports.run = async (bot) => {
  bot.registerCommand("checkowo", async (message, args) => {

    if (bot.checkPermission(message, "botAdmin") && (message.mentions[0] || args[0])) {
      const listOfMessages = []
      let amountOfOwO = 0

      const hrStart = process.hrtime()

      // setup embed
      const showEmbed = {
        embed: {
          title: "OwO check started",
          description: "check started",
          color: bot.getEmbedColor(bot, message),
          timestamp: new Date()
        }
      }
      const sentMessage = await bot.createMessage(message.channel.id, showEmbed)

      // decide how to get the user object
      let userToCheck
      if (!message.mentions[0]) {
        userToCheck = message.channel.guild.members.find(member => member.id == args[0])
      } else {
        userToCheck = message.mentions[0]
      }
      
      // get all messages in all channels and put them into `listOfMessages`
      const getAllChannelMessages = new Promise(async function(resolve, reject) {
        let channelCounter = 0
        showEmbed.embed.description = "Getting messages from channels"
        await sentMessage.edit(showEmbed)

        await message.channel.guild.channels.forEach(async(channel) => {
          if (channel.type == 0) {
            while (true) {
              let second = await channel.getMessages(100, listOfMessages[listOfMessages.length-1] ? listOfMessages[listOfMessages.length-1].id : channel.lastMessageID)
              if (second.length == 0) break
              second.forEach(channelMessage => {
                if (!listOfMessages.includes(channelMessage)) {
                  listOfMessages.push(channelMessage)
                }
              })
              console.log(`${channel.name} ~ ${listOfMessages.length}`)
            }
          }
          channelCounter++
          if (channelCounter === message.channel.guild.channels.size) {
            resolve()
          }
        })
      })

      // once `listOfMessages` contents all messages check them for owo and the check user
      getAllChannelMessages.then(async() => {
        let messageCounter = 0
        const owoInChannels = {}

        showEmbed.embed.description = `Counting owo's in channels`
        await sentMessage.edit(showEmbed)

        listOfMessages.forEach(async(messageInChannel) => {

          if (messageInChannel.content == "owo" && messageInChannel.author.id == userToCheck.id) {
            if (!Object.keys(owoInChannels).includes(messageInChannel.channel.id)) owoInChannels[messageInChannel.channel.id] = 0
            amountOfOwO++
            owoInChannels[messageInChannel.channel.id]++
          }
          messageCounter++
          if (messageCounter === listOfMessages.length) {
            let owoPerChannel = ""
            for (channelID in owoInChannels) {
              owoPerChannel += `<#${channelID}> - \`${owoInChannels[channelID]}\`\n`
            }

            const hrDiff = process.hrtime(hrStart)
            const checkowoEmbed = {
              embed: {
                author: {
                  name: `${userToCheck.username}#${userToCheck.discriminator}`,
                  icon_url: userToCheck.avatarURL
                },
                color: bot.getEmbedColor(bot, message),
                fields: [
                  {
                    name: "Total OwO's",
                    value: `\`${amountOfOwO}\``
                  },
                  {
                    name: "OwO's Per Channel",
                    value: owoPerChannel ? owoPerChannel : "`0`"
                  }
                ],
                footer: {
                  text: `${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}ms.`
                },
                timestamp: new Date()
              }
            }
            await sentMessage.edit(checkowoEmbed)
            await bot.createMessage(message.channel.id, `<@${message.author.id}>`)
            const listOfMessages = []
          }
        })
      })
    } else {
      const errorEmbed = {
        embed: {
          title: "Error",
          description: "You rather don't have bot admin permission or entered in the wrong parameters",
          color: bot.color.red,
          timestamp: new Date()
        }
      }
      bot.createMessage(message.channel.id, errorEmbed)
    }
  })
}