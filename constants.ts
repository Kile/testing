export const PREFIX = '?'; // The prefix to use for shop commands

export const TESTING_CHANNEL = '843479673941393478'; //Channel where testing happens
export const SHOP_CHANNEL = '843492206296039474'; //Channel for commands relating to testing
export const CLEARANCE_LVL_ONE_ROLE = ''; //Role to assign once a user obtains clearance level one

export const ITEMS = {
  // Changing anything in here will break things!
  '1': {
    name: 'Basic Test Widget',
    info: 'A basic testing widget, earned when successful tests are completed.',
    footer:
      '"Patience and perseverance have a magical effect before which difficulties disappear and obstacles vanish." -John Quincy Adams',
    quality: 'poor',
    slot: 'unequippable',
    price: 1
  },
  '2': {
    name: 'Advanced Testing Permit',
    info: 'An advanced testing permit. Unlocks more advanced tests, obviously.',
    footer:
      '"Widgets? Why on earth are widgets required to craft a testing permit? And what do you mean by advanced tests?" -A disgruntled test participant',
    quality: 'uncommon',
    slot: 'unequippable',
    price: 5
  },
  '3': {
    name: 'Clearance Badge: Level 1',
    info:
      'While equipped, access is granted to the level 1 testing facilities.',
    footer: 'Total days without a Level 1 testing accident: 0',
    quality: 'rare',
    slot: 'Badge',
    price: 'not sellable',
    stats: { scrunity: 6 }
  },
  '4': {
    name: 'Crash Test Helmet',
    info:
      'Safety standards dictate that anything beyond a basic test should be performed with a safety helmet. Safety officials are less likely to revoke your testing permits when proper safety measures are taken.',
    footer:
      '"Employees working in areas where there is a possible danger of head injury from impact, or from falling or flying objects, or from electrical shock and burns, shall be protected by protective helmets." -OSHA 1926.100(a)',
    quality: 'rare',
    slot: 'Head',
    price: 'not sellable',
    cost: 150,
    stats: { brain: 1, safety: 3 }
  },
  '5': {
    name: 'Safety Shoes',
    info:
      'Steel-toed boots protect your toes from objects falling upon them. A recent study conducted by management found that toe related injuries are the #7 cause of productivity loss within a testing environment.',
    footer:
      '"We can dance if we want to, we\'ve got all your life and mine, as long as we abuse it, never gonna lose it, everything\'ll work out right" - Men in Direct Violation of OSCA Safety Standards',
    quality: 'uncommon',
    slot: 'Feet',
    price: 'not sellable',
    cost: 85,
    stats: { safety: 2 }
  },
  '6': {
    name: 'Efficiency Gauntlets',
    info:
      'Not to be confused with the infinity gauntlet (which management has instructed me to neither confirm nor deny the existence of), the efficency gauntlets increase the efficiency of your tests, incresing widget yield.',
    footer: 'Standard Testing Equipment. Please check your mailbox.',
    quality: 'uncommon',
    slot: 'Hands',
    price: 'not sellable',
    stats: { efficiency: +3 }
  }
};

// Default values for a users data
export const DEFAULT_VALUES = {
  inventory: {},
  coins: 0,
  used_mail: false,
  stats: {},
  skill: {}
};

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
export const COLORS = {
  poor: discord.decor.RoleColors.GRAY,
  uncommon: discord.decor.RoleColors.GREEN,
  rare: discord.decor.RoleColors.BLUE
};
