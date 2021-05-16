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

  constructor(user_id: number) {
    this.id = user_id;
    this.rawData = {};
    this.inventory = {};
    this.stats = {};
    this.skill = {};
    this.used_mail = false;
    this.coins = 0;
  }

  private overlayJson(
    obj1: pylon.JsonObject,
    obj2: pylon.JsonObject
  ): pylon.JsonObject {
    const res = {};
    for (const key in obj1) {
      (res as any)[key] = obj1[key];
      if (obj2[key]) {
        (res as any)[key] += obj2[key];
      }
    }
    return res;
  }

  async getData(): Promise<User> {
    //This basically sets all the properties as the constructor is not asyncronous which is needed for the db
    // if the user does not exist, it adds the default values
    let data = await db.get(this.id);
    if (!data) {
      data = await this.addDefault();
    }
    this.rawData = data;
    this.inventory = (data as any)['inventory'];
    this.coins = (data as any)['coins'];

    return this;
  }

  async addDefault(): Promise<pylon.JsonObject> {
    // Adds the default values if a user is not in the database
    await db.save(this.id, CONSTANTS.DEFAULT_VALUES);
    return CONSTANTS.DEFAULT_VALUES;
  }

  hasItem(item: number): boolean {
    // Checks if a user has a certain item
    return ((this.inventory as unknown) as pylon.JsonObject).hasOwnProperty(
      item
    );
  }

  isEquipped(item: number): boolean {
    // Checks if a user has a certain item equipped
    return (this.inventory as any)[item]['equipped'];
  }

  async addCoins(amount: number): Promise<undefined> {
    // removes coins from a users account
    let newData = this.rawData['coins'][this.coins + amount];
    await db.transact(this.id, () => newData);
    return;
  }

  async removeCoins(amount: number): Promise<undefined> {
    // adds coins to a users account
    this.rawData['coins'] = this.coins - amount;
    await db.transact(this.id, () => this.rawData);
    return;
  }

  async equip(item: number): Promise<undefined> {
    // Equips an item
    this.rawData['inventory'][item] = true;
    this.rawData['stats'] = this.overlayJson(
      this.rawData['inventory'][item]['stats'],
      this.stats
    );
    await db.transact(this.id, () => this.rawData);
    return;
  }

  async addItem(item: number, amount: number = 1): Promise<any> {
    if ([1, 2].includes(item)) {
      // if it is a collectable, it adds one more of it
      this.rawData['inventory'][item] =
        (this.rawData['inventory'][item] ?? 0) + amount;
    } else {
      // if it is not a collectable, it gets added as a not equipped item
      this.rawData['inventory'][item] = false;
    }
    await db.transact(this.id, () => this.rawData);
  }

  async removeItem(item: number, amount: number = 1): Promise<any> {
    if (!(await this.hasItem(item))) {
      throw new Error('The user does not own this item');
    }
    if (this.rawData['inventory'][item] < amount) {
      throw new Error('The user does not own this item');
    }
    if ([1, 2].includes(item)) {
      // I added this check in case I ever implement non-collectables being removable
      this.rawData['inventory'][item] =
        this.rawData['inventory'][item] - amount;
      if (this.rawData['inventory'][item] == 0) {
        delete this.rawData['inventory'][item];
      }
    }
    await db.transact(this.id, () => this.rawData);
  }

  async increaseSkill(skill: string, amount: number = 1): Promise<any> {
    this.rawData['skill'][skill] = (this.rawData['skill'][skill] ?? 0) + amount;
    await db.transact(this.id, () => this.rawData);
  }

  async craft(): Promise<any> {
    await this.removeItem(1, 5);
    await this.addItem(2);
    await this.increaseSkill('Crafting');
  }

  async emptyMailbox(): Promise<any> {
    this.rawData.inventory.used_mail = true;
    await db.transact(this.id, () => this.rawData);
  }

  isAdvanced(): boolean {
    return ((this.inventory as unknown) as JSON).hasOwnProperty(2);
  }

  getStat(stat: string): number {
    return this.stats[stat] ?? 0;
  }
}
