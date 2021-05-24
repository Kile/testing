import * as db from './db';
import * as CONSTANTS from './constants';

export class User {
  id: number;
  rawData: any;
  inventory: any;
  coins: number;
  used_mail: boolean;
  stats: any;
  skill: any; // This is not yet used, but seen in Jakes source code
  mail_reward: any;
  clearance_level: number;

  constructor(user_id: number) {
    this.id = user_id;
    this.rawData = {};
    this.inventory = {};
    this.stats = {};
    this.skill = {};
    this.used_mail = false;
    this.coins = 0;
    this.mail_reward = {};
    this.clearance_level = 0;
  }

  private overlayJson(
    obj1: pylon.JsonObject,
    obj2: pylon.JsonObject
  ): pylon.JsonObject {
    const res: any = {};
    for (const key in obj1) {
      res[key] = obj1[key];
      if (obj2[key]) {
        res[key] += obj2[key];
      }
    }
    for (const [key, val] of Object.entries(obj2)) {
      if (!res.hasOwnProperty(key)) {
        res[key] = val;
      }
    }
    return res;
  }

  private substractJson(
    obj1: pylon.JsonObject,
    obj2: pylon.JsonObject
  ): pylon.JsonObject {
    const res: any = {};
    for (const key in obj1) {
      res[key] = obj1[key];
      if (obj2[key]) {
        res[key] = res[key] - (obj2[key] as any);
        if (res[key] <= 0) {
          delete res[key];
        }
      }
    }
    return res;
  }

  async getData(): Promise<User> {
    //This basically sets all the properties as the constructor is not asyncronous which is needed for the db
    // if the user does not exist, it adds the default values
    let data = await db.get(this.id);
    if (!data) data = await this.addDefault();

    this.rawData = data;
    this.used_mail = (data as any).used_mail;
    this.inventory = (data as any).inventory;
    this.coins = (data as any).coins;
    this.stats = (data as any).stats;
    this.skill = (data as any).skill;
    this.mail_reward = (data as any).mail_reward;
    this.clearance_level = (data as any).clearance_level;

    return this;
  }

  async addDefault(): Promise<pylon.JsonObject> {
    // Adds the default values if a user is not in the database
    await db.save(this.id, CONSTANTS.DEFAULT_VALUES);
    return CONSTANTS.DEFAULT_VALUES;
  }

  hasItem(item: number): boolean {
    // Checks if a user has a certain item
    return (this.inventory as any).hasOwnProperty(item);
  }

  isEquipped(item: number): boolean {
    // Checks if a user has a certain item equipped
    return (this.inventory as any)[item].equipped;
  }

  async addCoins(amount: number): Promise<void> {
    // adds coins to a Users account
    this.rawData.coins = this.coins + amount;
    await db.transact(this.id, () => this.rawData);
  }

  async removeCoins(amount: number): Promise<void> {
    // removes coins from a Users account
    if (this.coins < 1) throw new Error('User does not have any coins');
    this.rawData.coins = this.coins - amount;
    await db.transact(this.id, () => this.rawData);
  }

  async equip(
    item: number,
    equip: boolean,
    m: discord.GuildMember
  ): Promise<void> {
    // Equips or unequips an item
    this.rawData.inventory[item] = !equip;
    // This looks for if an item is already equipped, if it is it removes that item
    let old_equip = Object.keys(this.inventory).find(
      (key) =>
        CONSTANTS.ITEMS[key].slot === CONSTANTS.ITEMS[item].slot &&
        this.inventory[item] == true &&
        item !== +key
    );
    if (old_equip) {
      this.rawData.inventory[old_equip] = false;
      this.rawData.stats = this.substractJson(
        this.stats,
        CONSTANTS.ITEMS[old_equip].stats
      );
      if (CONSTANTS.ITEMS[old_equip].type == 'badge') {
        await m.removeRole(CONSTANTS.ITEMS[old_equip].role).catch((e) => {});
      }
    }
    if (!equip) {
      this.rawData.stats = this.overlayJson(
        this.rawData.stats,
        CONSTANTS.ITEMS[item].stats
      );
    } else {
      this.rawData.stats = this.substractJson(
        this.rawData.stats,
        CONSTANTS.ITEMS[item].stats
      );
    }
    if (CONSTANTS.ITEMS[item].type == 'badge') {
      !equip
        ? await m.addRole(CONSTANTS.ITEMS[item].role).catch((e) => {})
        : await m.removeRole(CONSTANTS.ITEMS[item].role).catch((e) => {});
    }
    await db.transact(this.id, () => this.rawData);
  }

  async addItem(item: number, amount: number = 1): Promise<void> {
    if (CONSTANTS.ITEMS[item].type == 'collectable') {
      // if it is a collectable, it adds one more of it
      this.rawData['inventory'][item] =
        (this.rawData['inventory'][item] ?? 0) + amount;
    } else {
      // if it is not a collectable, it gets added as a not equipped item
      this.rawData['inventory'][item] = false;
    }
    await db.transact(this.id, () => this.rawData);
  }

  async removeItem(item: number, amount: number = 1): Promise<void> {
    if (!(await this.hasItem(item)))
      throw new Error('The user does not own this item');
    if (this.rawData['inventory'][item] < amount)
      throw new Error('The user does not own this item');

    if (CONSTANTS.ITEMS[item].type == 'collectable') {
      // I added this check in case I ever implement non-collectables being removable
      this.rawData['inventory'][item] =
        this.rawData['inventory'][item] - amount;
      if (this.rawData['inventory'][item] == 0) {
        delete this.rawData['inventory'][item];
      }
    }
    await db.transact(this.id, () => this.rawData);
  }

  async addStock(): Promise<void> {
    // Adds a stock to a users inventory. These behave different from normal items
    this.rawData.inventory.stocks = (this.inventory.stocks ?? 0) + 1;
    await db.transact(this.id, () => this.rawData);
  }

  async removeStock(): Promise<void> {
    // Removes a stock from the inventory
    if ((this.inventory.stocks ?? 0) < 1) throw new Error('No stocks mate');
    this.rawData.inventory.stocks = this.inventory.stocks - 1;
    await db.transact(this.id, () => this.rawData);
  }

  async increaseSkill(skill: string, amount: number = 1): Promise<void> {
    // Increases a certain skill
    this.rawData['skill'][skill] = (this.rawData['skill'][skill] ?? 0) + amount;
    await db.transact(this.id, () => this.rawData);
  }

  async craft(): Promise<void> {
    // Crafts a new advanced testing permit or pc
    if (
      this.hasItem(15) &&
      this.hasItem(16) &&
      this.hasItem(17) &&
      this.hasItem(18)
    ) {
      for await (let i of [15, 16, 17, 18]) await this.removeItem(i);
      await this.addItem(19);
      await this.increaseSkill('crafting');
      return;
    }
    await this.removeItem(1, 5);
    await this.addItem(2);
    await this.increaseSkill('crafting');
  }

  async emptyMailbox(): Promise<string> {
    // Empties the mailbox
    await this.addItem(this.mail_reward.item);
    let text = this.mail_reward.message;
    this.rawData.used_mail = true;
    this.rawData.mail_reward = null;
    await db.transact(this.id, () => this.rawData);
    return text;
  }

  async addMail(mail: number, message: string): Promise<void> {
    this.rawData.used_mail = false;
    this.rawData.mail_reward = { item: mail, message: message };
    await db.transact(this.id, () => this.rawData);
  }

  isAdvanced(): boolean {
    // Checks if the user can conduct advanced tests
    return (this.inventory as any).hasOwnProperty(2);
  }

  getStat(stat: string): number {
    // Get the stats in a certain field
    return this.stats[stat] ?? 0;
  }

  isAuthorised(required: number): boolean {
    // Checks if a user is authorised with a certain badge
    return (this.stats.authorisation ?? 0) >= required;
  }
}