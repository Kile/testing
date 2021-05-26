
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
I recreated the adventure like system from Jake's server. It is a system where you type "test" in one channel to earn testing tokens, you can craft those to advanced testing tokens, you can also sell them, buy items etc. 
The catch is, you only know a small amount of commands. The rest are hidden for the user to find out. To progress you need to follow clues and find out the right commands. 
I also added **3** more clearance levels which should make stuff a lot more interesting

⚠️ **This means looking at this code will ruin your first experience** ⚠️ (provided you understand it, except if the system leads you here).

# Public commands
you can reveal these commands to your members, they are the starting commands you get given 
```
<prefix>inventory
<prefix>equipment
<prefix>info [id]
<prefix>equip [id]
<prefix>directory
```
For the other commands, the game gives out hints to the members itself. If you wish to place the hints somewhere else on your server, maybe as an activity reward then you can do that

# How to set it up
First, add [Pylon](https://pylon.bot) to your server. 

Then, add the files and file content in this repository to the online editor

There are certain constants in `constants.ts` you should edit, such as

`PREFIX`, `TESTING_CHANNEL`, `SHOP_CHANNEL`, `TESTING_LVL_ONE_ROLE` etc

with their respective ids

# Recommended channel structure
```
- testing area
  #test
  #shop
  #clearance-lvl-1*

- executive-area
  #executive-meetings*
  #stock-market
  #executive-control-center
```
`- testing-area` category 

`#test` should have a slowmode that is removed or lowered with the clearance level 1 role

`#shop` is the commands channel which the `SHOP_CHANNEL` constant should contain the id of. This channel should have everyone unable to see the history to prevent people from finding out commands. This can also have the given commands as channel description

`#clearance-lvl-1` the star indicates it is optional. This would be a general chat for people with clearance role 1 to discuss progress

`- executive-area` category

`#executive-meetings` is also an optional channel, unlocked by clearance level 2 which serves as a general for people with that clearance level

`#stock-market` This is the testing channel for executives although executives don't test, they `buy` or `sell` stocks

`#executive-control-center` This is `#shop` for executives and above. It surves the purpose of not revealing too many commands to level 0s. Executives should use their commands here. Nonetheless members should be unable to read the channel history


# Something about eval.ts
`eval.ts` conatins an eval command that allows administrators to manipulate the database. This is useful for testing, cheating and trolling. Here are a few examples of how to chaange data without much effort with this command.

`<prefix>eval  (new u('<user_id>').getData()).then(d => d.addCoins(<coins>))` replacing `<user_id>` and `<coins>` adds a certain amount of coins to the user with that id. This works also via versa with `removeCoins()`.
 
`<prefix>eval db.del('<user_id>')` Deletes the entire data of a user. I used this when I messed up my data structure while testing. Can also be used for trolling

`<prefix>eval  (new u('<user_id>').getData()).then(d => d.addItem(<item_id>))` replacing `<user_id>` and `<item_id>` adds the provided item (if it exists) to the user provided. This also works via versa with `removeItem()`.

# What can I modify
If you like to add your own twist to the game, my system should be able to handle it. You can modify description, title, name price etc of existing items. What you cannot do is replace items with other ones. This breaks the system if you don't make sure to adapt every place the item is mentioned. You can add more items without any trouble with an id higher than 20 though, this shoud be no problem and is sure to make the system more interesting. 

If you have any good idea of what to add, make a pull request!