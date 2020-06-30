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

/*
  BIG PROTOTYPE SO YEAH ITS SHITLY WRITTEN
*/

const formatter = new Intl.NumberFormat('en-US')

exports.run = (bot) => {
  bot.registerCommand('zoostats', async (message, args) => {
    if (message.channel.guild.id !== "667900803528261657") return

    let zooMessage = ''

    for (let i = 0; i < args.length; i++) {
      const gotHBMessage = await bot.getMessage(message.channel.id, args[i])
      zooMessage += gotHBMessage.content
    }

    let output = zooMessage.split('/(.*)/g')
    const total = {}
    let lastRank = ''
    const findSmallNumbers = /([⁰¹²³⁴⁵⁶⁷⁸⁹]){1,9}/g

    output = output[0].split('\n')

    for (let i = 0; i < output.length; i++) {
      // common
      if (output[i].match(/:common:/g)) {
        lastRank = 'common'
        const commonNumbers = output[i].match(findSmallNumbers)
        let commonTotal = 0

        for (let j = 0; j < commonNumbers.length; j++) {
          let numberString = ''

          for (let num = 0; num < commonNumbers[j].length; num++) {
            numberString += smallNumbersToBig[commonNumbers[j][num]]
          }

          commonTotal += parseInt(numberString)
        }
        total.common = { cowoncy: commonTotal, essence: commonTotal }
      }

      // uncommon
      if (output[i].match(/:uncommon:/g)) {
        lastRank = 'uncommon'
        const uncommonNumbers = output[i].match(findSmallNumbers)
        let uncommonTotal = 0

        for (let j = 0; j < uncommonNumbers.length; j++) {
          let numberString = ''

          for (let num = 0; num < uncommonNumbers[j].length; num++) {
            numberString += smallNumbersToBig[uncommonNumbers[j][num]]
          }

          uncommonTotal += parseInt(numberString)
        }
        total.uncommon = { cowoncy: (uncommonTotal * 3), essence: (uncommonTotal * 5) }
      }

      // rare
      if (output[i].match(/:rare:/g)) {
        lastRank = 'rare'
        const rareNumbers = output[i].match(findSmallNumbers)
        let rareTotal = 0

        for (let j = 0; j < rareNumbers.length; j++) {
          let numberString = ''

          for (let num = 0; num < rareNumbers[j].length; num++) {
            numberString += smallNumbersToBig[rareNumbers[j][num]]
          }

          rareTotal += parseInt(numberString)
        }
        total.rare = { cowoncy: (rareTotal * 10), essence: (rareTotal * 20) }
      }

      // epic
      if (output[i].match(/:epic:/g)) {
        lastRank = 'epic'
        const epicNumbers = output[i].match(findSmallNumbers)
        let epicTotal = 0

        for (let j = 0; j < epicNumbers.length; j++) {
          let numberString = ''

          for (let num = 0; num < epicNumbers[j].length; num++) {
            numberString += smallNumbersToBig[epicNumbers[j][num]]
          }

          epicTotal += parseInt(numberString)
        }
        total.epic = { cowoncy: (epicTotal * 250), essence: (epicTotal * 250) }
      }

      // mythic
      if (output[i].match(/:mythic:/g)) {
        lastRank = 'mythic'
        const mythicNumbers = output[i].match(findSmallNumbers)
        let mythicTotal = 0

        for (let j = 0; j < mythicNumbers.length; j++) {
          let numberString = ''

          for (let num = 0; num < mythicNumbers[j].length; num++) {
            numberString += smallNumbersToBig[mythicNumbers[j][num]]
          }

          mythicTotal += parseInt(numberString)
        }
        total.mythic = { cowoncy: (mythicTotal * 5000), essence: (mythicTotal * 3000) }
      }

      // patreon
      if (output[i].match(/:patreon:/g)) {
        lastRank = 'patreon'
        const patreonNumbers = output[i].match(findSmallNumbers)
        let patreonTotal = 0

        for (let j = 0; j < patreonNumbers.length; j++) {
          let numberString = ''

          for (let num = 0; num < patreonNumbers[j].length; num++) {
            numberString += smallNumbersToBig[patreonNumbers[j][num]]
          }

          patreonTotal += parseInt(numberString)
        }
        total.patreon = { cowoncy: (patreonTotal * 1000), essence: (patreonTotal * 500) }
      }

      // cpatreon
      if (output[i].match(/:cpatreon:/g)) {
        lastRank = 'cpatreon'
        const cpatreonNumbers = output[i].match(findSmallNumbers)
        let cpatreonTotal = 0

        for (let j = 0; j < cpatreonNumbers.length; j++) {
          let numberString = ''

          for (let num = 0; num < cpatreonNumbers[j].length; num++) {
            numberString += smallNumbersToBig[cpatreonNumbers[j][num]]
          }

          cpatreonTotal += parseInt(numberString)
        }
        total.cpatreon = { cowoncy: (cpatreonTotal * 50000), essence: (cpatreonTotal * 25000) }
      }

      // legendary
      if (output[i].match(/:legendary:/g)) {
        lastRank = 'legendary'
        const legendaryNumbers = output[i].match(findSmallNumbers)
        let legendaryTotal = 0

        for (let j = 0; j < legendaryNumbers.length; j++) {
          let numberString = ''

          for (let num = 0; num < legendaryNumbers[j].length; num++) {
            numberString += smallNumbersToBig[legendaryNumbers[j][num]]
          }

          legendaryTotal += parseInt(numberString)
        }
        total.legendary = { cowoncy: (legendaryTotal * 15000), essence: (legendaryTotal * 10000) }
      }

      // gem
      if (output[i].match(/:gem:/g)) {
        lastRank = 'gem'
        const gemNumbers = output[i].match(findSmallNumbers)
        let gemTotal = 0

        for (let j = 0; j < gemNumbers.length; j++) {
          let numberString = ''

          for (let num = 0; num < gemNumbers[j].length; num++) {
            numberString += smallNumbersToBig[gemNumbers[j][num]]
          }

          gemTotal += parseInt(numberString)
        }
        total.gem = { cowoncy: (gemTotal * 30000), essence: (gemTotal * 20000) }
      }

      // botrank
      if (output[i].match(/:botrank:/g)) {
        lastRank = 'botrank'
        const botrankNumbers = output[i].match(findSmallNumbers)
        let botrankTotal = 0

        for (let j = 0; j < botrankNumbers.length; j++) {
          let numberString = ''

          for (let num = 0; num < botrankNumbers[j].length; num++) {
            numberString += smallNumbersToBig[botrankNumbers[j][num]]
          }

          botrankTotal += parseInt(numberString)
        }
        total.botrank = { cowoncy: (botrankTotal * 10000), essence: (botrankTotal * 50000) }
      }

      // fabled
      if (output[i].match(/:fabled:/g)) {
        lastRank = 'fabled'
        const fabledNumbers = output[i].match(findSmallNumbers)
        let fabledTotal = 0

        for (let j = 0; j < fabledNumbers.length; j++) {
          let numberString = ''

          for (let num = 0; num < fabledNumbers[j].length; num++) {
            numberString += smallNumbersToBig[fabledNumbers[j][num]]
          }

          fabledTotal += parseInt(numberString)
        }
        total.fabled = { cowoncy: (fabledTotal * 250000), essence: (fabledTotal * 100000) }
      }

      // special
      if (output[i].match(/:special:/g)) {
        lastRank = 'special'
        const specialNumbers = output[i].match(findSmallNumbers)
        let specialTotal = 0

        for (let j = 0; j < specialNumbers.length; j++) {
          let numberString = ''

          for (let num = 0; num < specialNumbers[j].length; num++) {
            numberString += smallNumbersToBig[specialNumbers[j][num]]
          }

          specialTotal += parseInt(numberString)
        }
        total.special = { cowoncy: (specialTotal * 6000), essence: (specialTotal * 5000) }
      }

      // hidden
      if (output[i].match(/:hidden:/g)) {
        lastRank = 'hidden'
        const hiddenNumbers = output[i].match(findSmallNumbers)
        let hiddenTotal = 0

        for (let j = 0; j < hiddenNumbers.length; j++) {
          let numberString = ''

          for (let num = 0; num < hiddenNumbers[j].length; num++) {
            numberString += smallNumbersToBig[hiddenNumbers[j][num]]
          }

          hiddenTotal += parseInt(numberString)
        }
        total.hidden = { cowoncy: (hiddenTotal * 500000), essence: (hiddenTotal * 1000000) }
      }

      // cpatreon || special
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
