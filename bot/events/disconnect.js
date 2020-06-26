// Disconnect event seems to like to spam
let hasDisconnectEventTrigger = false
setInterval(() => {hasDisconnectEventTrigger = false}, 300000) // 5 minutes

exports.run = async (bot) => {
  if (hasDisconnectEventTrigger) return
  hasDisconnectEventTrigger = true
  bot.log("botDisconnected")
}