
<p align="center">
  <a href"https://discord.com/invite/jake">
     <img src="https://cdn.discordapp.com/icons/242101182183505920/4887c1254bf7c5e173e01ebfee84c74d.png?size=256">
  </a>
</p>
<h4 align="center">Testing "rpg" code from Jake's server</h4>
<p align="center">
  <a href="https://discord.gg/zXqDHkm/">
    <img alt="Discord Server" src="https://img.shields.io/discord/691713541262147687.svg?label=Discord&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2&style=flat">
  </a>
  <a>
    <img alt="Lines" src="https://img.shields.io/tokei/lines/github/Kile/testing">
  </a>
  <a>
    <img scr="https://img.shields.io/github/commit-activity/Kile/testing">
  </a>
    <a>
    <img scr="https://img.shields.io/github/license/Kile/testing">
  </a>
</p>

# What is this
I recreated the adventure like system from Jake's server. It is a system where you type "test" in one channel to earn testing tokens, you can craft those to advanced testing tokens, you can also sell them, buy items etc. The catch is, you only know a small amount of commands. The rest are hidden for the user to find out. To progress you need to follow clues and find out the right commands. ⚠️ **This means looking at this code will ruin your first experience** ⚠️ (provided you understand it).

# Public commands
you can reveal these commands to your members, they are the starting commands you get given 
```
<prefix>inventory
<prefix>equipment
<prefix>info [id]
<prefix>equip [id]
<prefix>directory
```

# How to use it
First, add [Pylon](https://pylon.bot) to your server. 

Then, add the files and file content in this repository to the online editor

There are certain constants in `constants.ts` you should edit, such as `PREFIX`, `TESTING_CHANNEL`, `SHOP_CHANNEL` and `TESTING_LVL_ONE_ROLE`
with their respective ids

It is recommended to add a slowmode to the `TESTING_CHANNEL` which is removed with the `TESTING_LVL_ONE_ROLE`. Also, the history in the `SHOP_CHANNEL` should not be visible to anyone to keep unknon commands unknown

# Something about eval.ts
`eval.ts` conatins an eval command that allows administrators to manipulate the database. This is useful for testing, cheating and trolling. Here are a few examples of how to chaange data without much effort with this command.

`<prefix>eval  (new u(<user_id>).getData()).then(d => d.addCoins(<coins>))` replacing `<user_id>` and `<coins>` adds a certain amount of coins to the user with that id. This works also via versa with `removeCoins()`.
 
`<prefix>eval db.del(<user_id>)` Deletes the entire data of a user. I used this when I messed up my data structure while testing. Can also be used for trolling

`<prefix>eval  (new u(<user_id>).getData()).then(d => d.addItem(<item_id>))` replacing `<user_id>` and `<item_id>` adds the provided item (if it exists) to the user provided. This also works via versa with `removeItem()`.

# What can I modify
Generally, modifying more than you are supposed to can break stuff easily. Make sure you understand my code before you make changes to it. Some parts are designed to work with more than provided, some are not
