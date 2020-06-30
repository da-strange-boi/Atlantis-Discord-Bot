const { spawn } = require('child_process')
exports.run = async (bot) => {
  bot.registerCommand('resetStats', async (message, args) => {
    const userid = message.author.id
    if (userid === '295255543596187650' || userid === '183324029334192129' || userid === '494540660943224844' || userid === '625340848556474369') {
      const runDailiesResetFile = spawn('node', ['bot/handlers/resettingStatsDailies.js'])

      bot.log('system', 'Stats reset')

      runDailiesResetFile.stderr.on('data', (data) => {
        bot.log('error', `stats stderr: ${data}`)
      })

      runDailiesResetFile.on('close', (code) => {
        bot.log('system', 'Stats Reset Complete')
      })
    }
  })
}
