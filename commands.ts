import * as CONSTANTS from './constants';
import * as functions from './functions';
import { User } from './classes';

export const commands = new discord.command.CommandGroup({
  defaultPrefix: CONSTANTS.PREFIX
});

commands.on(
  {
    name: 'equip',
    filters: discord.command.filters.isChannelId(CONSTANTS.SHOP_CHANNEL),
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
    filters: discord.command.filters.isChannelId(CONSTANTS.SHOP_CHANNEL),
    onError: (ctx, error) => {
      return;
    }
  },
  (args) => ({ item: args.integer() }),
  async (message, { item }) => {
    return await message.reply(functions.info(item) as any);
  }
);

commands.on(
  {
    name: 'r',
    filters: discord.command.filters.isChannelId(CONSTANTS.SHOP_CHANNEL),
    onError: (ctx, error) => {
      return;
    }
  },
  (args) => ({ text: args.textOptional() }),
  async (message, { text }) => {
    if (!text) {
      return await functions.unknownCommand(message);
    }
    if (text !== 'e l a x . t a k e a l o a d o f f .') {
      return await functions.unknownCommand(message);
      // Stupid way to do it but works Ig
    }
    await functions.relax(message);
  }
);

commands.raw(
  {
    name: 'mail',
    filters: discord.command.filters.isChannelId(CONSTANTS.SHOP_CHANNEL)
  },
  async (message) => {
    let u = await new User(+message.author.id).getData();
    if (u.used_mail) {
      return await message.reply(
        'you glance into your mailbox, finding nothing but a bunch of cobwebs, the mailbox reminds you of yourself - empty inside'
      );
    }
    await u.emptyMailbox();
    await message.reply(
      'you glance into your mailbox, a box was waiting for you, you unbox it, and store the item in your inventory'
    );
  }
);

commands.raw(
  {
    name: 'equipment',
    filters: discord.command.filters.isChannelId(CONSTANTS.SHOP_CHANNEL)
  },
  async (message) => {
    let embed = await functions.equipment(message);
    await message.reply(embed);
  }
);

commands.raw(
  {
    name: 'directory',
    filters: discord.command.filters.isChannelId(CONSTANTS.SHOP_CHANNEL)
  },
  async (message) => {
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
||[redacted]||
Required Items: [Clearance Badge: Level 1]
*not all zones visible`
      })
    );
  }
);

commands.raw(
  {
    name: 'craft',
    filters: discord.command.filters.isChannelId(CONSTANTS.SHOP_CHANNEL)
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
    filters: discord.command.filters.isChannelId(CONSTANTS.SHOP_CHANNEL)
  },
  async (message) => {
    let embed = await functions.constructInventory(message);
    await message.reply(embed);
  }
);

commands.on(
  {
    name: 'sell',
    filters: discord.command.filters.isChannelId(CONSTANTS.SHOP_CHANNEL),
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
    filters: discord.command.filters.isChannelId(CONSTANTS.SHOP_CHANNEL),
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
  if (message.channelId !== CONSTANTS.SHOP_CHANNEL) {
    return;
  }
  await functions.unknownCommand(message);
});
