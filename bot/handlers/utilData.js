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
    cowoncy: 1000000,
    essence: 500000
  }
}

const allOwoCommands = [
  'ab', 'acceptbattle', 'battle', 'battlesetting', 'crate', 'db',
  'declinebattle', 'pets', 'pet', 'rename', 'team', 'teams', 'setteam',
  'squads', 'useteams', 'weapon', 'weaponshard', 'describe', 'desc',
  'equip', 'use', 'inventory', 'inv', 'autohunt', 'huntbot', 'hb',
  'hunt', 'h', 'catch', 'lootbox', 'lb', 'owodex', 'od', 'dex', 'd',
  'sacrifice', 'essence', 'butcher', 'sac', 'sc', 'sell', 'upgrade', 'upg',
  'zoo', 'cowoncy', 'money', 'currency', 'cash', 'credit', 'balance', 'daily',
  'give', 'send', 'quest', 'buy', 'shop', 'market', 'checklist', 'task', 'tasks',
  'cl', 'gif', 'pic', 'choose', 'pick', 'decide', 'roll', 'd20', 'define', 'eightball',
  '8b', 'ask', '8ball', 'blush', 'cry', 'dance', 'lewd', 'pout', 'shrug', 'sleepy',
  'smile', 'smug', 'thumbsup', 'wag', 'thinking', 'triggered', 'teehee', 'deredere',
  'thonking', 'scoff', 'happy', 'thumbs', 'grin', 'cuddle', 'hug', 'insult', 'kiss',
  'lick', 'nom', 'pat', 'poke', 'slap', 'stare', 'highfive', 'bite', 'greet', 'punch',
  'handholding', 'tickle', 'kill', 'hold', 'pats', 'wave', 'boop', 'snuggle', 'fuck',
  'sex', 'bully', 'blackjack', 'bj', '21', 'coinflip', 'cf', 'coin', 'flip', 'drop',
  'pickup', 'lottery', 'let', 'lotto', 'slots', 'slot', 's', 'distractedbf', 'distracted',
  'drake', 'isthisa', 'slapcar', 'slaproof', 'spongebobchicken', 'schicken', 'alastor',
  'army', 'bunny', 'cake', 'coffee', 'java', 'crown', 'cupachicake', 'cpc', 'dish',
  'gauntlet', 'icecream', 'lollipop', 'milk', 'pizza', 'poutine', 'rum', 'sharingan',
  'bell', 'strengthtest', 'teddy', 'yinyang', 'yy', 'my', 'me', 'guild', 'top', 'rank',
  'ranking', 'acceptmarriage', 'am', 'cookie', 'rep', 'declinemarriage', 'dm', 'divorce',
  'emoji', 'enlarge', 'jumbo', 'level', 'lvl', 'levels', 'xp', 'propose', 'marry', 'marriage',
  'wife', 'husband', 'owo', 'owoify', 'ify', 'pray', 'curse', 'profile', 'ship', 'combine',
  'translate', 'listlang', 'wallpaper', 'wp', 'wallpapers', 'background', 'backgrounds',
  'avatar', 'user', 'announce', 'changelog', 'announcement', 'announcements', 'censor',
  'color', 'randcolor', 'colour', 'randcolour', 'covid', 'cv', 'covid19', 'coronavirus',
  'disable', 'enable', 'feedback', 'question', 'report', 'suggest', 'guildlink', 'help',
  'invite', 'link', 'math', 'calc', 'calculate', 'merch', 'patreon', 'donate', 'ping',
  'pong', 'prefix', 'rule', 'rules', 'shards', 'shard', 'stats', 'stat', 'info',
  'uncensor', 'vote'
]

module.exports = {
  smallNumbersToBig: smallNumbersToBig,
  rankData: rankData,
  allOwoCommands: allOwoCommands
}
