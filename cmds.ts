import { commands } from './commands';
import { User } from './classes';
import { unknownCommand } from './functions';
import * as CONSTANTS from './constants';
import * as pswd from './pswd';

async function handleCommand(
  message: discord.Message,
  cmd: string
): Promise<string | Promise<void>> {
  const player: User = await new User(message.author.id).getData();
  if (!player.hasItem(19)) {
    return await unknownCommand(message);
  }
  if (cmd.startsWith('giveperm')) {
    cmd = cmd.replace('giveperm', '');
    const args = cmd.split('--');
    if (args.length !== 3) {
      return 'Invalid arguments. Use `help` for help';
    }
    for (const i in args) {
      if (i == 'admin') {
        continue;
      }
      let parts = i.split(':');
      if (parts.length != 2) {
        return 'Invalid arguments. Use `help` for help';
      }
      if (parts[0] == 'u') {
        if (parts[1].replace(' ', '') != 'discowd') {
          return 'Invalid user. Use `help` for help';
        } else {
          continue;
        }
      }
      if (parts[0] == 'pswd') {
        if (parts[1].replace(' ', '') != (await pswd.getPassword(message))) {
          return 'Invalid password. Use `help` for help';
        } else {
          continue;
        }
      }
      return 'Invalid fields specified. Use `help` for help';
    }
    // YAY they won here
    await player.addItem(20);
    return 'Congratulations! You have finished the game! You used your system admin permissions to change the database to display you as the CEO! Testing Inc. is now your company. What a success story. I hope you liked it :3';
  }
  if (cmd == 'user') {
    // Gets the username
    return '\> discowd';
  }
  if (cmd == 'hint') {
    return '\> You saved this hint for your password:\nhttps://github.com/Kile/testing/blob/main/pswd.ts';
  }
  if (cmd == 'help') {
    return '\> Commands:\n   giveperm --[permission] --u: [user_to_grant_perms] --pswd: [admin_password]\n   user\n   hint';
  }
  if (cmd == 'ls') {
    return 'main.ts\nhentai.png\nconfig.json\nsrc';
  }
  return '\> Command not found. Use `help` for help';
}

commands.on(
  {
    name: 'cmd',
    filters: discord.command.filters.isChannelId(CONSTANTS.EXECUTIVE_CHANNEL)
  },
  (args) => ({ cmd: args.text() }),
  async (message, { cmd }) => {
    let res = await handleCommand(message, cmd);
    if (res) return await message.reply('```\n' + res + '\n```');
  }
);