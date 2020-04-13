// Hey maxi im watching you 👀
exports.run = async (bot) => {
  bot.registerCommand("checkowo", async (message, args) => {
    if (bot.checkPermission(message, "botAdmin") && (message.mentions[0] || args[0])) {

      let owoMessageList = []
      amountOfOwO = 0

      const hrStart = process.hrtime()

      // setup embed
      const showEmbed = {
        embed: {
          title: "OwO check started",
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

      let updateEmbed

      // Get messages that contain owo
      const getOwoMessages = new Promise(async function(finished, reject) {
        let channelCounter = 0
        showEmbed.embed.description = `Getting messages in channels`
        await sentMessage.edit(showEmbed)

        await message.channel.guild.channels.forEach(async(channel) => {
          if (channel.type == 0) {
            let lastMessageChecked = ""
            while (true) {
              let getMessagesInChannel = await channel.getMessages(100, lastMessageChecked != "" ? lastMessageChecked : channel.lastMessageID)
              if (getMessagesInChannel.length == 0) break
              getMessagesInChannel.forEach(gotMessage => {
                lastMessageChecked = gotMessage.id
                if (gotMessage.content == "owo" && gotMessage.author.id == userToCheck.id) {
                  owoMessageList.push(gotMessage)
                }
              })
            }
            console.log(`${channel.name} ~ ${owoMessageList.length}`)
          }

          // updateEmbed = setInterval(async() => {showEmbed.embed.description = `Getting messages in channels: ${owoMessageList.length}`;await sentMessage.edit(showEmbed)}, 10000)

          channelCounter++
          if (channelCounter == message.channel.guild.channels.size) {
            finished()
          }
        })
      })

      // handle afterwards
      getOwoMessages.then(async() => {
        console.log("eee")
        let messageCounter = 0
        const owoInChannels = {}

        // clearInterval(updateEmbed)

        showEmbed.embed.description = `Counting owo's in channels`
        await sentMessage.edit(showEmbed)

        owoMessageList.forEach(async(messageInChannel) => {

          if (messageInChannel.content == "owo" && messageInChannel.author.id == userToCheck.id) {
            if (!Object.keys(owoInChannels).includes(messageInChannel.channel.id)) owoInChannels[messageInChannel.channel.id] = 0
            amountOfOwO++
            owoInChannels[messageInChannel.channel.id]++
          }
          messageCounter++
          if (messageCounter === owoMessageList.length) {
            let owoPerChannel = ""
            for (channelID in owoInChannels) {
              owoPerChannel += `<#${channelID}> - \`${owoInChannels[channelID]}\`\n`
            }
            console.log("bbb")

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
                  text: `${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}`
                },
                timestamp: new Date()
              }
            }
            await sentMessage.edit(checkowoEmbed)
            console.log("111")
            await bot.createMessage(message.channel.id, `<@${message.author.id}>`)
            owoMessageList = []
          }
        })
      })
    }
  })
}