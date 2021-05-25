import * as CONSTANTS from './constants';
import * as functions from './functions';
import { User } from './classes';

export const commands = new discord.command.CommandGroup({
  defaultPrefix: CONSTANTS.PREFIX
});

commands.on(
  {
    name: 'decode',
    filters: CONSTANTS.FILTER,
    onError: (ctx, error) => {
      return;
    }
  },
  (args) => ({ text: args.text() }),
  async (message, { text }) => {
    await message.reply(await functions.textify(message, text));
  }
);

commands.on(
  {
    name: 'encode',
    filters: CONSTANTS.FILTER,
    onError: (ctx, error) => {
      return;
    }
  },
  (args) => ({ text: args.text() }),
  async (message, { text }) => {
    await message.reply(await functions.codify(message, text));
  }
);
commands.on(
  {
    name: 'equip',
    filters: CONSTANTS.FILTER,
    onError: (ctx, error) => {
      return;
    }
  },
  (args) => ({ item: args.integer() }),
  async (message, { item }) => {
    return await functions.equip(message, item);
  }
);

commands.on(
  {
    name: 'info',
    filters: CONSTANTS.FILTER,
    onError: (ctx, error) => {
      return;
    }
  },
  (args) => ({ item: args.integer() }),
  async (message, { item }) => {
    return await message.reply((await functions.info(message, item)) as any);
  }
);

// Sneaky hidden command
commands.raw(
  {
    name: 'ZGVtb25z',
    filters: CONSTANTS.FILTER,
    onError: (ctx, error) => {
      return;
    }
  },
  async (message) => {
    let u = await new User(+message.author.id).getData();
    if (!u.hasItem(8) || !u.isAuthorised(1) || u.hasItem(10)) {
      return await message.delete(); // Ensuring the command stays a secret
    }
    u.addItem(10);
    await message.reply(
      'With a smile an executive welcomes you to the exucutive area. Happy you walk to your bigger office. "You can say goodbye to testing now", the executive says and shows you your new workspace'
    );
  }
);
commands.on(
  {
    name: 'r',
    filters: CONSTANTS.FILTER,
    onError: (ctx, error) => {
      return;
    }
  },
  (args) => ({ text: args.textOptional() }),
  async (message, { text }) => {
    if (!text) {
      return await functions.unknownCommand(message);
    }
    if (text !== 'e l a x  .  t a k e   a   l o a d   o f f   .') {
      return await functions.unknownCommand(message);
      // Stupid way to do it but works Ig
    }
    await functions.relax(message);
  }
);

commands.raw(
  {
    name: 'mail',
    filters: CONSTANTS.FILTER
  },
  async (message) => {
    let u = await new User(+message.author.id).getData();
    if (u.used_mail) {
      return await message.reply(
        'you glance into your mailbox, finding nothing but a bunch of cobwebs, the mailbox reminds you of yourself - empty inside'
      );
    }
    let resp = await u.emptyMailbox();
    await message.reply(resp);
  }
);

commands.raw(
  {
    name: 'equipment',
    filters: CONSTANTS.FILTER
  },
  async (message) => {
    let embed = await functions.equipment(message);
    await message.reply(embed);
  }
);
//open.spotify.com/track/4ciaNqHWA2IzHphZaVRzHI?si=a7be8d8003d4471b
https: commands.raw(
  {
    name: 'directory',
    filters: CONSTANTS.FILTER
  },
  async (message) => {
    let u = await new User(+message.author.id).getData();
    await message.reply(
      new discord.Embed({
        title: 'Test Facility Directory',
        description: `**Testing Area: A**
The main testing area. Basic and advanced tests may be conducted here.

**The Stockwell**
Run by a rather grumpy, and also mute shopkeeper. Don't bother showing up if you don't have any coin.

**Employee Break Room**
https://www.youtube.com/watch?v=WYUOKnZkgko

**Testing Area: Level 1 Clearance**
${
  u.isAuthorised(1)
    ? 'Everyone here is listening to the newest hit song https://open.spotify.com/track/4ciaNqHWA2IzHphZaVRzHI?si=a7be8d8003d4471b though you prefer the number one song "test- 1-2-3 test"'
    : `||[redacted]||
Required Items: [Clearance Badge: Level 1]
*not all zones visible`
}`
      })
    );
  }
);

commands.raw(
  {
    name: 'craft',
    filters: CONSTANTS.FILTER
  },
  async (message) => {
    let u = await new User(+message.author.id).getData();
    try {
      await u.craft();
    } catch (_) {
      return await message.reply('Not enough widgets to craft.');
    }
    await message.reply('A new item has been crafted.');
  }
);

commands.raw(
  {
    name: 'inventory',
    filters: CONSTANTS.FILTER
  },
  async (message) => {
    let embed = await functions.constructInventory(message);
    await message.reply(embed);
  }
);

commands.on(
  {
    name: 'sell',
    filters: CONSTANTS.FILTER,
    onError: (ctx, error) => {
      ctx.message.reply(functions.randomChoice(CONSTANTS.SELL_RESPONSES));
    }
  },
  (args) => ({ item: args.integer(), amount: args.integerOptional() }),
  async (message, { item, amount }) => {
    await functions.sellItem(message, item, amount ?? 1);
  }
);

commands.on(
  {
    name: 'buy',
    filters: CONSTANTS.FILTER,
    onError: (ctx, error) => {
      ctx.message.reply('the shopkeeper looks at you curiously');
    }
  },
  (args) => ({ item: args.number() }),
  async (message, { item }) => {
    await functions.buyItem(message, item);
  }
);

// Handles if the command is unknown
commands.defaultRaw(async (message) => {
  if (
    ![CONSTANTS.SHOP_CHANNEL, CONSTANTS.EXECUTIVE_CHANNEL].includes(
      message.channelId
    )
  ) {
    return;
  }
  await functions.unknownCommand(message);
});