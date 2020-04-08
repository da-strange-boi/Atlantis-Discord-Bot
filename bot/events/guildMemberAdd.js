const Canvas = require("canvas")
const path = require("path")

const applyText = (canvas, text) => {
  const ctx = canvas.getContext("2d")
  let fontSize = 70
  do {
    ctx.font = `${fontSize -= 1}px impact`
  } while (ctx.measureText(text).width > canvas.width - 300)
  return ctx.font
}

/** @param {import("eris").Client} bot */
exports.run = async (bot, guild, member) => {
  if (member) {
    if (!member.user.bot) {
      bot.database.Userdata.findOne({ userID: member.id }, async (err, userdata) => {
        if (err) bot.log("error", err)
        if (!userdata) {
          bot.database.Userdata.insertOne({
            userID: member.id,
            hunt: true,
            battle: false,
            owo: false,
            praycurse: true,
            huntbot: true
          })
        }
      })

      // Show member add card
      bot.database.Guilddata.findOne({ guildID: guild.id }, async (err, guilddata) => {
        if (err) bot.log("error", err)

        if (guilddata && guilddata.welcomeChannel[0] != " ") {
          let welcomeChannel = guild.channels.find(channel => channel.id == guilddata.welcomeChannel[0])
          const canvas = Canvas.createCanvas(700, 250)
          const ctx = canvas.getContext("2d")

          const background = await Canvas.loadImage(path.join(__dirname, "../images/greeting.jpg"))
          ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

          // Welcome
          ctx.font = "65px impact"
          ctx.fillStyle = "#ffffff"
          ctx.strokeStyle = "#00008b"
          ctx.miterLimit = 2
          ctx.lineJoin = "circle"
          ctx.lineWidth = 6
          ctx.strokeText("WELCOME", canvas.width / 1.95, canvas.height / 3)
          ctx.lineWidth = 1
          ctx.fillText(`WELCOME`, canvas.width / 1.95, canvas.height / 3)

          // Discord User Tag
          const userTag = `${member.user.username}#${member.user.discriminator}`.toUpperCase()
          ctx.font = applyText(canvas, `${userTag}`)
          ctx.fillStyle = "#ffffff"
          ctx.strokeStyle = "#00008b"
          ctx.miterLimit = 2
          ctx.lineJoin = "circle"
          ctx.lineWidth = 6
          ctx.strokeText(`${userTag}`, canvas.width / 2.5, canvas.height / 1.7)
          ctx.lineWidth = 1
          ctx.fillText(`${userTag}`, canvas.width / 2.5, canvas.height / 1.7)

          // To {Server Name}
          ctx.font = applyText(canvas, `TO ${guild.name.toUpperCase()}`)
          ctx.fillStyle = "#ffffff"
          ctx.strokeStyle = "#00008b"
          ctx.miterLimit = 2
          ctx.lineJoin = "circle"
          ctx.lineWidth = 6
          ctx.strokeText(`TO ${guild.name.toUpperCase()}!`, canvas.width / 2.5, canvas.height / 1.2)
          ctx.lineWidth = 1
          ctx.fillText(`TO ${guild.name.toUpperCase()}!`, canvas.width / 2.5, canvas.height / 1.2)

          // Arc the Profile Picture
          ctx.beginPath()
          ctx.arc(125, 125, 100, 0, Math.PI*2, true)
          ctx.strokeStyle = "#00008b"
          ctx.lineWidth = 8
          ctx.stroke()
          ctx.closePath()
          ctx.clip()

          const avatar = await Canvas.loadImage(member.avatarURL)
          ctx.drawImage(avatar, 25, 25, 200, 200)

          let defaultText
          if (guilddata.welcomeChannel[1]) {
            let parseText = guilddata.welcomeChannel[1]
            parseText = parseText.replace("{user}", `<@${member.id}>`)
            parseText = parseText.replace("{user_username}", member.user.username)
            parseText = parseText.replace("{user_tag}", `${member.user.username}#${member.user.discriminator}`)
            parseText = parseText.replace("{server}", guild.name)
            defaultText = parseText
          } else {
            defaultText = `Welcome to **${guild.name}**, ${member}`
          }
          bot.createMessage(welcomeChannel.id, defaultText, {file:canvas.toBuffer(), name:"welcome-card.png"})
        }
      })
    }
  }
}