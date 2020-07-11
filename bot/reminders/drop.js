const _ = require('lodash')
const dropCoolDown = 30000
const dropTimeouts = {}

// Reminder for drop/pickup
exports.reminder = async (bot, message, messageContent, customPrefix, userdata) => {
  if (messageContent.match(new RegExp(customPrefix.source + (/(drop|pick)/g).source))) {
    if (userdata) {
      if (!_.has(dropTimeouts, message.author.id)) {
        dropTimeouts[message.author.id] = {}
      }
      if (_.has(dropTimeouts[message.author.id], 'drop')) {
        if (dropTimeouts[message.author.id].drop) return
      }
      dropTimeouts[message.author.id].drop = true

      setTimeout(async () => {
        dropTimeouts[message.author.id].drop = false

        if (userdata.drop) {
          bot.createMessage(message.channel.id, `<@${message.author.id}>, \`drop\` cooldown has passed! ${bot.emojis.native.drop}`).then(sentMessage => {
            setTimeout(() => { sentMessage.delete(`Deleted drop reminder for ${message.author.tag}`) }, 5000)
          })
        }
      }, dropCoolDown)
    }
  }
}
