/*

    HELLO THERE VISITOR! SEEMS LIKE YOU MADE IT THIS FAR!
    This is where the password is generated. Generated sounds like
    it is random but no, it is not. As a CTO, you should be able to
    read and understand the code to find out the password you need 
    to get your admin permissions

    Good Luck

    PS: While you're here, you could also star the repository :3
    - Unknown

*/

import { codify } from './functions';

function getFirst(): string {
  return [Map, Error, [[String]]]
    .flat(2)
    .map((v) => v.name.slice(0, 1).toLowerCase())
    .concat([
      (typeof '').slice(0, [0].length),
      ...Array.from(new Set(Error.name.replace(/[^age]/g, '').split('')))
        .join('')
        .toLowerCase()
    ])
    .join('');
}

function getThird(text: string): string {
  return text
    .split('')
    .map((c) => {
      if (['a', 'e', 'i', 'o', 'u'].includes(c.toLowerCase())) {
        return c.toLowerCase();
      } else {
        return c;
      }
    })
    .join('-');
}

export async function getPassword(message: discord.Message): Promise<string> {
  let first = getFirst().toUpperCase();
  let second = await codify(message, message.author.username);
  second = second
    .toLowerCase()
    .replace('n', '')
    .slice(0, 4)
    .toUpperCase();
  let t = getThird(first + second);
  return t;
}
