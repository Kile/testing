export const PREFIX = '?'; // The prefix to use for shop commands

export const TESTING_CHANNEL = '843479673941393478'; // Channel where testing happens
export const SHOP_CHANNEL = '843492206296039474'; // Channel for commands relating to testing
export const STOCK_CHANNEL = '846144496747020328'; // The stocks channel for buying and selling
export const EXECUTIVE_CHANNEL = '846167786166026271'; // The commands channel for the executives
export const CLEARANCE_LVL_ONE_ROLE = '843797044513603614'; // Role to assign once a user obtains clearance level one
export const CLEARANCE_LVL_TWO_ROLE = '845998896760881212'; // Role to assign once a user obtains clearance level two
export const CLEARANCE_LVL_THREE_ROLE = '846462561686781962'; // Role to assign once a user obtains clearance level three
export const CLEARANCE_LVL_FOUR_ROLE = '846462757390123030'; // Role to assign once a user obtains clearance level four
export const FILTER = discord.command.filters.channelIdIn([
  SHOP_CHANNEL,
  EXECUTIVE_CHANNEL
]);

interface Stats {
  efficency?: number; // Gives you more testing units
  brain?: number; // Not sure what to do with that yet
  safety?: number; // Makes it less likely for you to loose token
  swag?: number; // Makes you more likely to get bonuses
  authorisation?: number; // Every badge has one higher authorisation level
  luck?: number; // Luck for trading
}

interface Item {
  name: string; // The name of the item
  type: string; // The type, eg badge, item or collectable
  info: string; // Info about that item
  footer: string; // The footer used in the description embeds
  quality: string; // The rarity of the item
  slot?: string | undefined; // What slot the item is in
  price: number | string; // The price of the item
  cost?: number | string | undefined; // The cost of an item if you want to buy it
  stats?: Stats | undefined; // The stats an item adds
  role?: string | undefined; // The role a clearance badge gives
  clearance: number; // The clearance needed to see infos about that item
}

export const BADGES: any = {
  // The badges which basically symbolize the clearance levels
  1: {
    name: 'Clearance Badge: Level 1',
    type: 'badge',
    info:
      'While equipped, access is granted to the level 1 testing facilities.',
    footer: 'Total days without a Level 1 testing accident: 0',
    quality: 'rare',
    slot: 'Badge',
    price: 'not sellable',
    stats: { authorisation: 1 } as Stats,
    role: CLEARANCE_LVL_ONE_ROLE,
    clearance: 0
  } as Item,
  2: {
    name: 'Clearance Badge: Level 2',
    type: 'badge',
    info: 'While equipped one obtains the "supervisor" rank',
    footer: "Noticed someone's lack of efficiency yet?",
    quality: 'epic',
    slot: 'Badge',
    price: 'not sellable',
    stats: { authorisation: 2 } as Stats,
    role: CLEARANCE_LVL_TWO_ROLE,
    clearance: 1
  } as Item,
  3: {
    name: 'Clearance Badge: Level 3, CTO',
    type: 'badge',
    info: 'While equipped, you become CTO if Testing Inc.',
    footer: 'Have you tried turning it off and on again?',
    quality: 'legendary',
    slot: 'Badge',
    price: 'not sellable',
    stats: { authorisation: 3 } as Stats,
    role: CLEARANCE_LVL_THREE_ROLE,
    clearance: 2
  },
  4: {
    name: 'Clearance Badge: Level 4, CEO',
    type: 'badge',
    info: 'While equipped, you become the CEO of Testing Inc.',
    footer: 'Do you know what CEO stands for?',
    quality: 'mythic',
    slot: 'Badge',
    price: 'not sellable',
    stats: { authorisation: 4 } as Stats,
    role: CLEARANCE_LVL_FOUR_ROLE,
    clearance: 4
  }
};

export const ITEMS: any = {
  // Changing anything in here will break things!
  1: {
    name: 'Basic Test Widget',
    type: 'collectable',
    info: 'A basic testing widget, earned when successful tests are completed.',
    footer:
      '"Patience and perseverance have a magical effect before which difficulties disappear and obstacles vanish." -John Quincy Adams',
    quality: 'poor',
    slot: 'unequippable',
    price: 1,
    clearance: 0
  } as Item,
  2: {
    name: 'Advanced Testing Permit',
    type: 'collectable',
    info: 'An advanced testing permit. Unlocks more advanced tests, obviously.',
    footer:
      '"Widgets? Why on earth are widgets required to craft a testing permit? And what do you mean by advanced tests?" -A disgruntled test participant',
    quality: 'uncommon',
    slot: 'unequippable',
    price: 5,
    clearance: 0
  } as Item,
  3: BADGES[1],
  4: {
    name: 'Crash Test Helmet',
    type: 'item',
    info:
      'Safety standards dictate that anything beyond a basic test should be performed with a safety helmet. Safety officials are less likely to revoke your testing permits when proper safety measures are taken.',
    footer:
      '"Employees working in areas where there is a possible danger of head injury from impact, or from falling or flying objects, or from electrical shock and burns, shall be protected by protective helmets." -OSHA 1926.100(a)',
    quality: 'rare',
    slot: 'Head',
    price: 'not sellable',
    cost: 150,
    stats: { brain: 1, safety: 3 } as Stats,
    clearance: 0
  } as Item,
  5: {
    name: 'Safety Shoes',
    type: 'item',
    info:
      'Steel-toed boots protect your toes from objects falling upon them. A recent study conducted by management found that toe related injuries are the #7 cause of productivity loss within a testing environment.',
    footer:
      '"We can dance if we want to, we\'ve got all your life and mine, as long as we abuse it, never gonna lose it, everything\'ll work out right" - Men in Direct Violation of OSCA Safety Standards',
    quality: 'uncommon',
    slot: 'Feet',
    price: 'not sellable',
    cost: 85,
    stats: { safety: +2 } as Stats,
    clearance: 0
  } as Item,
  6: {
    name: 'Efficiency Gauntlets',
    type: 'item',
    info:
      'Not to be confused with the infinity gauntlet (which management has instructed me to neither confirm nor deny the existence of), the efficency gauntlets increase the efficiency of your tests, incresing widget yield.',
    footer: 'Standard Testing Equipment. Please check your mailbox.',
    quality: 'uncommon',
    slot: 'Hands',
    price: 'not sellable',
    stats: { efficiency: +3 } as Stats,
    clearance: 0
  } as Item,
  7: {
    name: 'Shiny Discord Hoodie',
    type: 'item',
    info:
      'Someone from discord must have dropped it here when visiting.... I think his name was Jake',
    footer: 'Wumpus sends his regards',
    quality: 'rare',
    slot: 'Chest',
    price: 'not sellable',
    cost: 500,
    stats: { swag: +2 } as Stats,
    clearance: 1
  } as Item,
  8: {
    name: 'Switchboard Operation Manual',
    type: 'item',
    info:
      'Level 1 Classified Switchboard Operational Manual. Highly classified material enclosed. Management requires that one looking to operate the level 1 switchboard read this manual closely, back to back.',
    footer: 'Et-tu, Brute?',
    quality: 'epic',
    slot: 'unequippable',
    price: 'not sellable',
    clearance: 1
  } as Item,
  9: {
    name: 'Diamond Pickaxe',
    type: 'item',
    info:
      'This pickaxe appeared after an intense evening of playing minecraft. It is enchanted with efficiency 2',
    footer: 'Shiny',
    quality: 'epic',
    slot: 'Main Hand',
    price: 'not sellable',
    cost: 750,
    stats: { swag: +2, efficency: +2 },
    clearance: 1
  } as Item,
  10: BADGES[2],
  11: {
    name: 'The One Ring',
    type: 'item',
    info:
      "How did the ring end up here? Somone must have found it while mining... holding it just for a second, just- for- it's so preciousss",
    footer: 'Rumors say a curse follows this ancient artefact',
    quality: 'epic',
    slot: 'Trinket',
    price: 'not sellable',
    cost: 1000,
    stats: { luck: +3 } as Stats,
    clearance: 2
  } as Item,
  12: {
    name: 'Programmer Socks',
    type: 'item',
    info:
      'Part of the gifts discord gave out when visiting the testing facility. Legend has it that it is from Jasons own collection',
    footer: 'owo',
    quality: 'epic',
    slot: 'Legs',
    price: 'not sellable',
    cost: 1500,
    stats: { luck: +5, swag: +10 } as Stats,
    clearance: 2
  } as Item,
  13: {
    name: 'Cash Bundle',
    type: 'item',
    info:
      'Show off your profits to your co-workers by taking a bundle of cash in your hand',
    footer: 'Money money money, must be funny, in the rich mans world',
    quality: 'epic',
    slot: 'Main Hand',
    price: 'not sellable', // Can't sell money, can you?
    cost: 2000,
    stats: { luck: +1, swag: +2 } as Stats,
    clearance: 2
  } as Item,
  14: BADGES[3],
  15: {
    name: 'Motherboard',
    type: 'item',
    info:
      'The base you need to build every computer. Maybe you can build one with it that does your job',
    footer: 'Was cheaper last time I looked for the rpice...',
    quality: 'legendary',
    slot: 'unequippable',
    price: 'not sellable',
    cost: 2000,
    clearance: 3
  } as Item,
  16: {
    name: 'Computer Screen',
    type: 'item',
    info: 'What’s the use of a working computer without a screen?',
    footer: 'Why is that one pixel not working?',
    quality: 'epic',
    slot: 'unequippable',
    price: 'not sellable',
    cost: 1500,
    clearance: 3
  } as Item,
  17: {
    name: 'Keyboard',
    type: 'item',
    info:
      "Something to type your `cmds`s on, sadly mind control hasn't been invented yet",
    footer: 'Nice rainbow lights',
    quality: 'epic',
    slot: 'unequippable',
    price: 'not sellable',
    cost: 1500,
    clearance: 3
  } as Item,
  18: {
    name: 'Computer Case',
    type: 'item',
    info: 'The finishing touch to a computer, securing it from dust',
    footer: 'Safety first',
    quality: 'rare',
    slot: 'unequippable',
    price: 'not sellable',
    cost: 1000,
    clearance: 3
  } as Item,
  19: {
    name: 'Computer',
    type: 'item',
    info:
      'A computer with admin permissions only crafted with the finest computer parts. Could you use it to make yourself CEO? Maybe with the right command and authorisation',
    footer: 'Linux > windows',
    quality: 'legendary',
    slot: 'unequippable',
    price: 'not sellable',
    clearance: 3
  } as Item,
  20: BADGES[4]
};

// Default values for a users data
export const DEFAULT_VALUES = {
  inventory: {},
  coins: 0,
  used_mail: false,
  stats: {},
  skill: {},
  mail_reward: {
    item: 6,
    message:
      'you glance into your mailbox, a box was waiting for you, you unbox it, and store the item in your inventory'
  },
  clearance_level: 0
};

// Slots for items
export const SLOTS = [
  'Head',
  'Chest',
  'Badge',
  'Hands',
  'Legs',
  'Feet',
  'Trinket',
  'Main Hand',
  'Off Hand'
];

// Those are the random sell responses when the parameters are invalid.
// feel free to add and remove responses as you like
export const SELL_RESPONSES = [
  'Error: Invalid Shop Parameters. Please refer to Trading Referendum 1.b',
  'Error: Invalid Shop Parameters. Parameters Inventory Stock'
];

// Colors assigned to rarities. Can be changed
export const COLORS: any = {
  poor: discord.decor.RoleColors.GRAY,
  uncommon: discord.decor.RoleColors.GREEN,
  rare: discord.decor.RoleColors.BLUE,
  epic: discord.decor.RoleColors.PURPLE,
  legendary: discord.decor.RoleColors.YELLOW,
  mythic: discord.decor.RoleColors.DARK_RED
};