const chalk = require('chalk')
const version = require("../../package.json")

const getCurrentDate = () => {
  const date = new Date()
  const formattedTime = `${date.getHours()}:${date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`} ${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`
  return `${chalk.yellow("[") + chalk.blue(formattedTime) + chalk.yellow("]")}`
}

const getContentFormat = (message) => {
  return `${chalk.yellow(" [") + message + chalk.yellow("] ")}`
}

/**
 * Logs a message to the console
 * @param {string} logType system, error, boOnline, dbConnected
 * @param {string} logMessage whatever the log should say
 */
const logging = async function Log (logType, logMessage) {
  switch (logType) {
    case 'system': console.log(chalk.inverse('[LOG][SYSTEM]') + getContentFormat(chalk.hex("#FFFFFF")(logMessage)) + getCurrentDate()); break
    case 'error': console.log(chalk.inverse('[LOG][ERROR]') + chalk.hex("#FF0000")(logMessage) + getCurrentDate()); break
    case 'statsPosted': console.log(chalk.inverse('[LOG][STATS]') + chalk.hex("#AA00FF")(logMessage) + getCurrentDate()); break
    case 'botOnline': console.log(chalk.inverse('[LOG][ONLINE]') + chalk.hex("#00FFFF")(` Version ${version.version} `) + getCurrentDate()); break
    case 'dbConnected': console.log(chalk.inverse('[LOG][SYSTEM]') + chalk.hex("#FFAA00")(' Database Connected Successfully ') + getCurrentDate()); break
    case 'botDisconnected': console.log(chalk.inverse('[LOG][DISCONNECT]') + chalk.hex("#00FF00")(' Bot Disconnected ') + getCurrentDate()); break
    default: console.log(chalk.inverse('[LOG][DEFAULT]') + getContentFormat(chalk.hex("#FFFFFF")(logMessage)) + getCurrentDate()); break
  }
}
module.exports = logging