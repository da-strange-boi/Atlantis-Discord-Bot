// Hey maxi im watching you 👀
const { inspect } = require("util")
exports.run = async (bot) => {
  bot.registerCommand("eval", async (message, args) => {
    if (await bot.checkPermission(message, "botAdmin")) {
      const toEval = args.join(" ")
      try {
        let evaluated
        let hrDiff
        async () => {
          const hrStart = process.hrtime()
          evaluated = inspect(eval(toEval, { depth: 0 }))
          hrDiff = process.hrtime(hrStart)
        }
        if (toEval) {
    
          const evalEmbed = {
            embed: {
              title: "Evaluation",
              color: bot.getEmbedColor(bot, message),
              fields: [
                {
                  name: ":scroll: Script",
                  value: `\`\`\`javascript\n${toEval}\n\`\`\``
                },
                {
                  name: ':white_check_mark: Result',
                  value: `\`\`\`javascript\n${evaluated}\n\`\`\``
                },
                {
                  name: ":alarm_clock: Evaluation Time",
                  value: `${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1] / 1000000}ms.`
                }
              ]
            }
          }

          bot.createMessage(message.channel.id, evalEmbed)
        } else {
          bot.createMessage(message.channel.id, "Error whilst evaluating: `cannot evaluated air`")
        }
      } catch (e) {
        bot.createMessage(message.channel.id, `Error whilst evaluating: \`${e.message}\``)
      }
    }
  })
}