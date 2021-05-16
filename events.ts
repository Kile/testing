import * as CONSTANTS from './constants';
import * as functions from './functions';

// This handles the "test" message to gain tokens
discord.on(discord.Event.MESSAGE_CREATE, async (message) => {
  if (message.channelId !== CONSTANTS.TESTING_CHANNEL) {
    return;
  }
  if (message.content !== 'test') {
    await message.delete();
    return;
  }
  await functions.handleTest(message);
});

// Deleting messages that aren't command in the shop channel
discord.on(discord.Event.MESSAGE_CREATE, async (message) => {
  if (message.channelId !== CONSTANTS.SHOP_CHANNEL) {
    return;
  }
  if (message.content.startsWith(CONSTANTS.PREFIX)) {
    return;
  }
  functions.unknownCommand(message);
});
