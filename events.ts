import * as CONSTANTS from './constants';
import * as functions from './functions';
import * as db from './db';

// This handles the "test" message to gain tokens
discord.on(discord.Event.MESSAGE_CREATE, async (message) => {
  if (message.channelId !== CONSTANTS.TESTING_CHANNEL) return;
  if (message.content !== 'test') return await message.delete();
  await functions.handleTest(message);
});

// This handles trading stocks
discord.on(discord.Event.MESSAGE_CREATE, async (message) => {
  if (message.channelId !== CONSTANTS.STOCK_CHANNEL) return;
  if (!['buy', 'sell'].includes(message.content.toLowerCase()))
    return await message.delete();
  await functions.handleStocks(message);
});

// Deleting messages that aren't command in the shop channel
discord.on(discord.Event.MESSAGE_CREATE, async (message) => {
  if (
    ![CONSTANTS.SHOP_CHANNEL, CONSTANTS.EXECUTIVE_CHANNEL].includes(
      message.channelId
    )
  )
    return;
  if (message.content.startsWith(CONSTANTS.PREFIX)) return;

  functions.unknownCommand(message);
});

// This is actually not necessary at all, just a small touch

// The roles to re-assign after rejoin if the user had them before
const roles = [
  CONSTANTS.CLEARANCE_LVL_TWO_ROLE,
  CONSTANTS.CLEARANCE_LVL_ONE_ROLE,
  CONSTANTS.CLEARANCE_LVL_THREE_ROLE,
  CONSTANTS.CLEARANCE_LVL_FOUR_ROLE
];

// Re-assigning certain roles on rejoin
discord.on(discord.Event.GUILD_MEMBER_REMOVE, async (member, oldMember) => {
  let guild = await discord.getGuild();
  // This just looks up the last audit log entry
  for await (let d of guild.iterAuditLogs()) {
    // Action type 20 means kicked
    if (d.actionType == 20 && d.targetId == member.user.id) return;

    break;
  }
  let to_be_returned: Array<string> = [];
  // Adds all roles that have been add to the var roles and the user has to "to_be_returned"
  for (let r of oldMember.roles) {
    for (let ro of roles) {
      if (ro == r) {
        to_be_returned.push(ro);
      }
    }
  }
  if (to_be_returned.length != 0) {
    // Saves the role data if the user has at least one role
    await db.save('role_' + member.user.id, to_be_returned);
  }
});

discord.on(discord.Event.GUILD_MEMBER_ADD, async (member) => {
  let m: Array<string> | null | undefined = await db.get(
    'role_' + member.user.id
  );
  if (!m) {
    // If no data exists
    return;
  }
  for (let r of m) {
    // Re-assignes the saved roles
    await member?.addRole(r);
  }
  // Deletes the entry to save space and prevent abuse
  await db.del('role_' + member.user.id);
});