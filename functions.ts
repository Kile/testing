import { User } from './classes';
import { ITEMS, SLOTS, SELL_RESPONSES, COLORS } from './constants';

export function randomChoice(arr: Array<any>): any {
  return arr[~~(Math.random() * arr.length)];
}

export async function unknownCommand(message: discord.Message): Promise<any> {
  await message.delete();
  let msg = await message.reply(
    'Unknown command ' + message.author.toMention()
  );
  await setTimeout(() => msg.delete(), 5000);
}

export async function handleTest(message: discord.Message): Promise<any> {
  const player = await new User(+message.author.id).getData();

  let choices = [
    'test incomplete, please try again later.',
    'test error, please re-submit test with form 2.1a',
    'test in progress, please try again later',
    'test inconclusive, please submit more sample data',
    'test running, check back later for results',
    'test unavailable, please check the number and try again',
    'test successful, a new item has been added to your inventory',
    'test successful, a new item has been added to your inventory',
    'test successful, a new item has been added to your inventory',
    'test successful, a new item has been added to your inventory',
    'test complete, further testing required, please re-test',
    'test complete'
  ];
  //Advanced testing is defined here
  const isAdvanced = player.isAdvanced();
  //The efficency does play a part of the items equipped
  const efficiencyStat = player.getStat('efficiency') + 1;

  // advanced tests have different dialog, and a fine chance of also failing.
  if (isAdvanced) {
    choices = [
      'advanced test in progress',
      'advanced test failed, permit revoked, continued failure will result in disciplinary action.',
      'advanced test complete',
      'advanced test success, more widgets have been dispensed to your inventory'
    ];
  }

  // flip of a coin here decides the rest of the game's actions.
  let choice = randomChoice(choices);

  if (efficiencyStat == 1) {
    choice += randomChoice([
      '',
      '',
      '\n(*a supervisor notes your lack of efficiency gauntlets in his notebook*)'
    ]);
  }
  await message.reply(async () => {
    // a random delay, because testing is never satisfying if it completes instantly.
    await sleep(1000 + ((3000 * Math.random()) | 0));

    // if inventory is in the response message, we need to grant the player widgets.
    // i know this is super hacky, (todo: write better system for handling dialog effects
    // for L1 - and maybe some clever/rare dialog effect combinations?)

    if (choice.indexOf('inventory') !== -1) {
      let quantity = isAdvanced ? 1 + ((Math.random() * 6) | 0) : 1;
      // efficiency is key here to make the yield even higher, no wonder the
      // supervisors were being pissed, imagine doing work way worse because
      // you forgot some gloves.
      quantity *= efficiencyStat;
      await player.addItem(1, quantity);
      await player.increaseSkill('testing'); // This is unused for all I know, but I am adding it anyways
    }
    // failed penalty, take away advanced testing permit.
    // obviously tests are more exciting if there is a risk to them!
    if (choice.indexOf('failed') !== -1 && isAdvanced) {
      await player.removeItem(2);
    }
    return choice;
  });
}

export async function constructInventory(
  message: discord.Message
): Promise<discord.Embed> {
  let u = await new User(+message.author.id).getData();
  let text;
  //@ts-ignore
  for (const [key, value] of Object.entries(u.inventory)) {
    if (typeof value === 'number') {
      text =
        (text ?? '') +
        `**[${
          (ITEMS as any)[key.toString()].name
        }]**: ${value}x (\`id = ${key}\`)\n`;
    } else {
      text =
        (text ?? '') +
        `**[${(ITEMS as any)[key.toString()].name}]**: 1x (\`id = ${key}\`, ${
          value ? '**equipped**' : '**unequipped**'
        })\n`;
    }
  }
  text = (text ?? 'No items\n') + '\n**Coins**\n' + u.coins.toString();

  let embed = new discord.Embed({
    title: 'Inventory for ' + message.author.getTag(),
    description: text
  });
  return embed;
}

export async function buyItem(
  message: discord.Message,
  item: number
): Promise<any> {
  let u = await new User(+message.author.id).getData();

  // different response for items that exist, but are not buyable
  if ([1, 2, 3, 6, 7, 8, 9].includes(item)) {
    return await message.reply(
      'the shopkeeper looks at you and shakes his head solumnly.'
    );
  }

  try {
    var price = (ITEMS as any)[item.toString()].cost;
  } catch (_) {
    return await message.reply('the shopkeeper looks at you curiously');
  }

  if (u.hasItem(item)) {
    return await message.reply('the shopkeeper looks at you curiously');
  }

  if (u.coins < price) {
    return await message.reply(
      'the shopkeeper looks at you, then at the sign on the door, then motions you away dismissively.'
    );
  }

  await u.removeCoins(price);
  await u.addItem(+item);

  return await message.reply(
    `the shopkeeper smiles takes your coin, handing you the item you've asked for
      ${
        item == 5
          ? ''
          : "\n\na loud horn sounds in the distance. it's break time, for some, at least."
      }`
  );
}

export async function sellItem(
  message: discord.Message,
  item: number,
  amount: number = 1
): Promise<discord.Message> {
  let u = await new User(+message.author.id).getData();
  if (!u.hasItem(item)) {
    // If the item is not in possesion
    return await message.reply(randomChoice(SELL_RESPONSES));
  }
  if (typeof (ITEMS as any)[item.toString()].price == 'string') {
    // Not sellable item
    return await message.reply(randomChoice(SELL_RESPONSES));
  }
  if (amount > u.inventory[item.toString()]) {
    // If the user tries to sell more than they have
    return await message.reply(randomChoice(SELL_RESPONSES));
  }

  await u.addCoins((ITEMS as any)[item.toString()].price * amount);
  await u.removeItem(item, amount);
  return await message.reply('Success: Transaction Complete. Coins Deposited.');
}

export async function equipment(
  message: discord.Message
): Promise<discord.Embed> {
  let u = await new User(+message.author.id).getData();
  let embed = new discord.Embed({
    title: message.author.getTag() + " 's equipped items"
  });
  for await (let s of SLOTS) {
    let count: number = 0;
    for (const [key, value] of Object.entries(u.inventory)) {
      if ((ITEMS as any)[key.toString()].slot == s && value == true) {
        embed.addField({
          name:
            s + ' (' + (ITEMS as any)[(key as any).toString()].quality + ')',
          value: '**' + (ITEMS as any)[(key as any).toString()].name + '**',
          inline: true
        });
        count = -1; // Making sure it doesn't get called twice
      }
      count = count + 1;
      if (count == Object.entries(u.inventory).length) {
        embed.addField({ name: s, value: '*(empty)*', inline: true });
        // This is a stupid way to prevent this happening more than once for every
        // slot but I could not think of a better way
      }
    }
  }
  let stats;
  let skill;
  for (const [key, value] of Object.entries(u.stats)) {
    stats = (stats ?? '') + `**+${value}** ${key}`;
  }

  embed.addField({
    name: 'Equipped Item Stats',
    value: stats ?? 'No stats yet'
  });

  for (const [key, value] of Object.entries(u.skill)) {
    skill = (skill ?? '') + `**${value}** ${key}`;
  }

  embed.addField({ name: 'Skill Levels', value: skill ?? 'No skill yet' });

  embed.addField({
    name: 'Clearance Level',
    value: (await u.hasItem(3)) ? '1' : '0'
  });
  //This needs to be changed in case more badges are added, I am just lazy for now
  return embed;
}

export async function relax(message: discord.Message): Promise<any> {
  let u = await new User(+message.author.id).getData();
  if (u.hasItem(3)) {
    //When author already has clearnce badge level 1
    return await message.reply(
      'you look around the break-room, and see your colleagues, you chat them up, but be careful not to mention any secrets beyond their clearance level'
    );
  }
  if (u.hasItem(4) && u.hasItem(5)) {
    // When author does not have the bdge but meets requirements
    return await message.reply(
      'you enter the break room and sit down after a long day of testing. you sigh and throw your head back and kick your feet up on the table like you own the place. a man approaches you with a clipboard, looking closely at your helmet and shoes. "Take this." he mutters, sliding a badge to you across the table "You\'ve earned it, bud." he continues, before a loud horn blares again, and he shuffles away, leaving you there, glancing down at the badge in-front of you. the second horn sounds, snapping you out of your trance and you quickly snatch the card and slip it into your pocket, before heading back to work.'
    );
  }
  await message.reply(
    'you look around the break-room, and see not a soul, a clock on the wall ticks. your internal voice reminds you to continue testing.'
  );
}

export function info(item: number): discord.Embed | string {
  var data = (ITEMS as any)[item.toString()];
  if (!data) {
    return '**Error:** Database rejected query `SELECT * FROM items WHERE id = ? AND clearance_level <= 1` - please continue testing.';
    // I am not adding the "redacted" thngs on purpose, once they serve a purpose they are worth adding
  }

  let embed = new discord.Embed({
    title: '[' + data.name + ']',
    footer: { text: data.footer },
    fields: [
      { name: 'Quality', value: data.quality, inline: true },
      { name: 'Slot', value: data.slot, inline: true },
      { name: 'Sell Price', value: data.price.toString(), inline: true },
      { name: 'Description', value: data.info }
    ]
  });
  if (data.stats) {
    let stats;
    for (const [key, value] of Object.entries(data.stats)) {
      stats = (stats ?? '') + `**+${value}** ${key}\n`;
    }
    embed.addField({ name: 'Stats', value: (stats ?? 'No stats').toString() });
  }
  embed.setColor((COLORS as any)[data.quality]);
  return embed;
}

export async function equip(
  message: discord.Message,
  item: number
): Promise<discord.Message> {
  let u = await new User(+message.author.id).getData();
  if (!u.hasItem(item)) {
    return await message.reply(
      '**Error**: Equipment manager malfunction. Unknown item specified.'
    );
  }
  const equipped: boolean = u.inventory[item];
  if (typeof equipped !== 'boolean') {
    return await message.reply(
      '**Error**: Equipment manager malfunction. Unknown item specified.'
    );
  }
  await u.equip(item, equipped, message.member!);
  return await message.reply(
    `**Success**: Item **[${(ITEMS as any)[item.toString()].name}]** has been ${
      equipped ? '**unequipped** from' : '**equipped** to'
    } the ${(ITEMS as any)[item.toString()].slot} slot.`
  );
}
