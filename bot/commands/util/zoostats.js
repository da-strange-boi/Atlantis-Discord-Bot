const smallNumbersToBig = {
  '⁰': 0,
  '¹': 1,
  '²': 2,
  '³': 3,
  '⁴': 4,
  '⁵': 5,
  '⁶': 6,
  '⁷': 7,
  '⁸': 8,
  '⁹': 9
}

const rankData = {
  common: {
    cowoncy: 1,
    essence: 1
  },
  uncommon: {
    cowoncy: 3,
    essence: 5
  },
  rare: {
    cowoncy: 10,
    essence: 20
  },
  epic: {
    cowoncy: 250,
    essence: 250
  },
  mythic: {
    cowoncy: 5000,
    essence: 3000
  },
  patreon: {
    cowoncy: 1000,
    essence: 500
  },
  cpatreon: {
    cowoncy: 50000,
    essence: 25000
  },
  legendary: {
    cowoncy: 15000,
    essence: 10000
  },
  gem: {
    cowoncy: 30000,
    essence: 20000
  },
  botrank: {
    cowoncy: 10000,
    essence: 50000
  },
  fabled: {
    cowoncy: 250000,
    essence: 100000
  },
  special: {
    cowoncy: 6000,
    essence: 5000
  },
  hidden: {
    cowoncy: 500000,
    essence: 1000000
  }
}

const formatter = new Intl.NumberFormat('en-US')

exports.run = (bot) => {
  bot.registerCommand('zoostats', async (message, args) => {
    if (!args[0]) {
      const errorEmbed = {
        embed: {
          title: 'Error',
          color: 0xFF0000,
          description: 'Must include at least 1 message ID'
        }
      }
      return bot.createMessage(message.channel.id, errorEmbed)
    }

    let zooMessage = ''

    for (let i = 0; i < args.length; i++) {
      const gotHBMessage = await message.channel.getMessage(args[i])
      zooMessage += gotHBMessage.content
    }

    let output = zooMessage.split('/(.*)/g')
    const total = {}
    let lastRank = ''
    const findSmallNumbers = /([⁰¹²³⁴⁵⁶⁷⁸⁹]){1,9}/g
    const allRanks = ['common', 'uncommon', 'rare', 'epic', 'mythic', 'patreon', 'cpatreon', 'legendary', 'gem', 'botrank', 'fabled', 'special', 'hidden']

    output = output[0].split('\n')

    for (let i = 0; i < output.length; i++) {
      for (let rank = 0; rank < allRanks.length; rank++) {
        const currentRankRegex = new RegExp(`:${allRanks[rank]}:`, 'g')
        if (currentRankRegex.test(output[i])) {
          lastRank = allRanks[rank]
          const getNumbers = output[i].match(findSmallNumbers)
          let totalOfRank = 0

          if (getNumbers == null) return bot.createMessage(message.channel.id, { embed: { title: 'Error', color: 0xFF0000, description: 'No values were found' } })
          for (let j = 0; j < getNumbers.length; j++) {
            let numberString = ''

            for (let num = 0; num < getNumbers[j].length; num++) {
              numberString += smallNumbersToBig[getNumbers[j][num]]
            }

            totalOfRank += parseInt(numberString)
          }
          total[allRanks[rank]] = { cowoncy: totalOfRank * (rankData[allRanks[rank]].cowoncy), essence: totalOfRank * (rankData[allRanks[rank]].essence) }
        }
      }

      // Special cases for :black:
      if (output[i].match(/:blank:/g)) {
        const animalNumbers = output[i].match(findSmallNumbers)
        let animalTotal = 0

        for (let j = 0; j < animalNumbers.length; j++) {
          let numberString = ''

          for (let num = 0; num < animalNumbers[j].length; num++) {
            numberString += smallNumbersToBig[animalNumbers[j][num]]
          }

          animalTotal += parseInt(numberString)
        }
        if (lastRank === 'cpatreon') {
          total[lastRank] = {
            cowoncy: total[lastRank].cowoncy + (animalTotal * 50000),
            essence: total[lastRank].essence + (animalTotal * 25000)
          }
        }
        if (lastRank === 'special') {
          total[lastRank] = {
            cowoncy: total[lastRank].cowoncy + (animalTotal * 6000),
            essence: total[lastRank].essence + (animalTotal * 5000)
          }
        }
      }
    }
    const zooStatsEmbed = {
      embed: {
        author: {
          name: message.author.username,
          icon_url: message.author.avatarURL
        },
        description: '',
        title: '',
        color: 0x4a90e2
      }
    }

    let totalCowoncy = 0
    let totalEssence = 0

    for (const rank in total) {
      totalCowoncy += total[rank].cowoncy
      totalEssence += total[rank].essence
      zooStatsEmbed.embed.description += `\`${rank}\`: **${formatter.format(total[rank].cowoncy)}** cowoncy | **${formatter.format(total[rank].essence)}** essence\n`
    }
    zooStatsEmbed.embed.title = `Total: ${formatter.format(totalCowoncy)} cowoncy | ${formatter.format(totalEssence)} essence`

    bot.createMessage(message.channel.id, zooStatsEmbed)
  })
}
