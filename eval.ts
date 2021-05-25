import { User } from './classes';
import * as d from './db';
import { commands } from './commands';

// This file serves the purpose that it makes it easier for the server owner / an admin
// to manually change data. A decent knowledge and understanding of the source code is required
commands.on(
  {
    name: 'eval',
    filters: discord.command.filters.isAdministrator()
  },
  (args) => ({
    code: args.text()
  }),
  async (message, { code }) => {
    let u = User;
    let db = d;
    code = code.replace(/\`\`\`.*\n*/g, '');
    try {
      var evaled = await eval(code);

      await message.reply(`\`\`\`js
${JSON.stringify(evaled)}
\`\`\``);
    } catch (err) {
      await message.reply(`\`\`\`js
${err}
\`\`\``);
    }
  }
);