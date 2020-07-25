const { spawn } = require('child_process')
const { CronJob } = require('cron')

// Delete daily stats
const resetDailyStats = new CronJob('0 0 3 * * *', async () => {
  const runDailiesResetFile = spawn('node', ['statsAndVotesReset/resettingStatsDailies.js'])

  console.log('system - Stats reset start')

  runDailiesResetFile.stderr.on('data', (data) => {
    console.log(data)
  })

  runDailiesResetFile.on('close', (code) => {
    console.log('system - Stats Reset Complete')
  })
}, null, true, 'America/New_York')
resetDailyStats.start()

// check last vote
const checkVotes = new CronJob('0 0 */1 * * *', async () => {
  const runCheckVotes = spawn('node', ['statsAndVotesReset/checkToResetCustom.js'])

  runCheckVotes.stderr.on('data', (data) => {
    console.log(data)
  })

  runCheckVotes.on('close', (code) => {
    console.log('system - Votes Check Complete')
  })
}, null, true, 'America/New_York')
checkVotes.start()
