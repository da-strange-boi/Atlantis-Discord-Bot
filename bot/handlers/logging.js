const chalk = require('chalk')
const version = require("../../package.json")

const getCurrentDate = () => {
  const date = new Date()
  return `${date.getHours()}:${date.getMinutes()} ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`
}

/**
 * Logs a message to the console
 * @param {string} logType system, error, boOnline, dbConnected
 * @param {string} logMessage whatever the log should say
 */
const logging = async function Log (logType, logMessage) {
  switch (logType) {
    case 'system': console.log(chalk.inverse('[LOG][SYSTEM]') + chalk.hex("#FFFFFF")(` ${logMessage} `) + chalk.blue(getCurrentDate())); break
    case 'error': console.log(chalk.inverse('[LOG][ERROR]') + chalk.hex("#FF0000")(` ${logMessage} `) + chalk.blue(getCurrentDate())); break
    // case 'statsPosted': console.log(chalk.inverse('[LOG][STATS POSTED]') + chalk.hex(config.color.lightblue)(` ${logMessage} `) + chalk.blue(getCurrentDate())); break
    case 'botOnline': console.log(chalk.inverse('[LOG][ONLINE]') + chalk.hex("#00FFFF")(` Version ${version.version} `) + chalk.blue(getCurrentDate())); break
    case 'dbConnected': console.log(chalk.inverse('[LOG][SYSTEM]') + chalk.hex("#FFAA00")(' Database Connected Successfully ') + chalk.blue(getCurrentDate())); break
    case 'botDisconnected': console.log(chalk.inverse('[LOG][DISCONNECT]') + chalk.hex("#00FF00")(' Bot Disconnected ') + chalk.blue(getCurrentDate())); break
    default: console.log(chalk.inverse('[LOG][DEFAULT]') + chalk.hex("#FFFFFF")(` ${logMessage} `) + chalk.blue(getCurrentDate())); break
  }
}
module.exports = logging