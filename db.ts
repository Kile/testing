// Florian Crafter (ClashCrafter#0001) - 02-05.2021 - Version 2.5.1
// Modified by Kile to only use what is necessary. Find the full code here: https://github.com/FlorianStrobl/Discord-Pylon-Bot/blob/master/Scripts/BetterKV/betterKV.ts

// this namespace will be used, if you don't specify a namespace
const defaultNamespace: string = 'database';

// pylons byte limit per KV key. you shoudn't change it!! If you bought BYOB and have higher byte limits, change the value here.
const maxByteSize: number = 8196;

// This is the default namespace.
export const Default_KV: pylon.KVNamespace = new pylon.KVNamespace(
  defaultNamespace
);

type worked = boolean;
type key = string | number;

// #region extern functions
// save a value to a key
export async function save(
  key: key,
  value: pylon.Json,
  namespace?: string,
  overwriteIfExist: boolean = true
): Promise<worked> {
  // validate inputs
  if (
    value === undefined ||
    (await getSize(value)) > maxByteSize ||
    key === null ||
    key === undefined ||
    key === 'databaseKeySize' ||
    (typeof key === 'string' && key.startsWith('database_'))
  )
    return false;

  key = key.toString();

  const KV: pylon.KVNamespace = await getKV(namespace);
  let size: number = await getDBKeySize(KV.namespace);
  let savedData: pylon.JsonObject;

  try {
    // check if key is already in some db key and change the value. return true if so
    for (let i: number = 0; i <= size; ++i) {
      savedData = await getInternalObject(i, KV.namespace);

      // search data in current db key
      const cvalue: pylon.Json | undefined = savedData[key];

      if (cvalue !== undefined) {
        // value does exist

        if (overwriteIfExist === false) return false;

        savedData[key] = value; // change value of existing data in local array

        if ((await saveInternalObject(savedData, i, KV.namespace)) === false) {
          // too many bytes for current key => delete object from current key and saving it as new
          delete savedData[key];
          await saveInternalObject(savedData, i, KV.namespace);
          //await dbKeyOrder(KV.namespace);
          await save(key, cvalue, KV.namespace);
        } else return true;
      }
    }

    // key is not in current database => try to save in an existing db key
    for (let i: number = 0; i <= size; ++i) {
      savedData = await getInternalObject(i, KV.namespace);

      // saving the data
      savedData[key] = value;

      if ((await saveInternalObject(savedData, i, KV.namespace)) === true)
        return true; // current key has space if true => data is saved in this db key
    }

    // no db key had space and key didn't exist yet => new db key is cerated and object saved there
    ++size;
    if (
      (await saveInternalObject({ [key]: value }, size, KV.namespace)) === true
    ) {
      await KV.put(`databaseKeySize`, size);
      return true;
    } else return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function transact(
  key: key,
  edit: (value: pylon.Json | undefined) => pylon.Json,
  namespace?: string,
  replaceUndefined?: boolean
): Promise<worked>;

export async function transact(
  key: key[],
  edit: (value: pylon.Json | undefined) => pylon.Json,
  namespace?: string,
  replaceUndefined?: boolean
): Promise<worked[]>;

// modify values on the fly
export async function transact(
  key: key | key[],
  edit: (value: pylon.Json | undefined) => pylon.Json,
  namespace?: string,
  replaceUndefined: boolean = false
): Promise<worked | worked[]> {
  if (Array.isArray(key)) {
    // array so just do this function recursively
    let workedForAll: worked[] = [];
    for await (const k of key)
      workedForAll.push(await transact(k, edit, namespace, replaceUndefined));
    return workedForAll;
    //return !workedForAll.includes(false);
  }

  key = key.toString();

  const KV: pylon.KVNamespace = await getKV(namespace);

  // try get current data
  const oldValue: pylon.Json | undefined = await get(key, KV.namespace);

  if (oldValue === undefined && replaceUndefined === false) return false;

  let newValue: pylon.Json = await edit(oldValue); // updated data locally

  if (newValue === undefined) return false;

  // object is too big
  if ((await getSize(newValue)) <= maxByteSize)
    return await save(key, newValue, KV.namespace);
  // updated object
  else return false;
}

export async function del(key: key, namespace?: string): Promise<worked>;

export async function del(key: key[], namespace?: string): Promise<worked[]>;

// delete the key(s) and it's value(s)
export async function del(
  key: key | key[],
  namespace?: string
): Promise<worked | worked[]> {
  if (Array.isArray(key)) {
    // array so just do this function recursively
    let workedForAll: worked[] = [];
    for await (const k of key) workedForAll.push(await del(k, namespace));
    return workedForAll;
    // if you just want to know if it was for every single one succesfull do:
    // return !workedForAll.includes(false);
  }

  key = key.toString();

  const KV: pylon.KVNamespace = await getKV(namespace);
  const size: number = await getDBKeySize(KV.namespace);

  // go through every db key and search for the key
  for (let i: number = 0; i <= size; ++i) {
    let savedData: pylon.JsonObject = await getInternalObject(i, namespace);

    // object is in current key
    if (savedData[key] !== undefined) {
      // found data and deleting it localy
      delete savedData[key];

      // update db key
      await saveInternalObject(savedData, i, KV.namespace);

      if (Object.keys(savedData).length === 0) await dbKeyOrder(KV.namespace); // db keys have to be sorted, because one of the db keys is now empty

      return true;
    }
  }

  // no key+data was deleted
  return false;
}

export async function exist(key: key, namespace?: string): Promise<boolean>;

export async function exist(key: key[], namespace?: string): Promise<boolean[]>;

// check if an key exist
export async function exist(
  key: key | key[],
  namespace?: string
): Promise<boolean | boolean[]> {
  if (Array.isArray(key)) {
    // array so just do this function recursively
    let exists: boolean[] = [];
    for await (const k of key)
      exists.push((await get(k, namespace)) !== undefined);
    return exists;
  }

  return (await get(key, namespace)) !== undefined;
}

export async function get<T extends pylon.Json>(
  key: key,
  namespace?: string
): Promise<T | undefined>;

export async function get<T extends pylon.Json>(
  key: key[],
  namespace?: string
): Promise<T[] | undefined>;

// get the values from the key(s)
export async function get<T extends pylon.Json>(
  key: key | key[],
  namespace?: string
): Promise<T | T[] | undefined> {
  if (Array.isArray(key)) {
    // array so just do this function recursively
    let values: (pylon.Json | undefined)[] = [];
    for await (const k of key) values.push(await get(k, namespace));
    return values as any;
  }

  key = key.toString();

  const KV: pylon.KVNamespace = await getKV(namespace);
  const size: number = await getDBKeySize(KV.namespace);

  // it is more optimized to go manually through the keys, than just doing GetAllValues() and searching there for the data
  for (let i: number = 0; i <= size; ++i) {
    // search for key in the db key and return the value if it exists
    const savedData: pylon.JsonObject = await getInternalObject(i, namespace);
    if (savedData[key] !== undefined) return (savedData as any)[key];
  }

  // key doesn't exist
  return undefined;
}

// get the KV for the namespace
async function getKV(namespace?: string): Promise<pylon.KVNamespace> {
  if (namespace !== undefined && namespace !== null)
    return new pylon.KVNamespace(namespace);
  else return Default_KV;
}

// get number of db keys in this namespace
async function getDBKeySize(namespace: string): Promise<number> {
  return (await (await getKV(namespace)).get<number>(`databaseKeySize`)) ?? 0;
}

async function getInternalObject(
  index: number,
  namespace?: string
): Promise<pylon.JsonObject> {
  const KV: pylon.KVNamespace = await getKV(namespace);
  return (await KV.get(`database_${index}`)) ?? {};
}

async function saveInternalObject(
  value: pylon.Json,
  index: number,
  namespace?: string
): Promise<boolean> {
  const KV: pylon.KVNamespace = await getKV(namespace);

  if ((await getSize(value)) <= maxByteSize) {
    await KV.put(`database_${index}`, value);
    return true;
  } else return false;
}

// correct empty db keys
async function dbKeyOrder(namespace: string): Promise<boolean> {
  const KV: pylon.KVNamespace = await getKV(namespace);
  let size: number =
    (await getDBKeySize(namespace)) === 0 ? -1 : await getDBKeySize(namespace);

  for (let i: number = 0; i <= size; ++i) {
    const data: pylon.JsonObject | undefined = await getInternalObject(
      i,
      namespace
    );

    if (data === undefined || Object.keys(data).length === 0) {
      // current key is empty

      // puts data from key x+1 in key x
      for (let y: number = i; y < size; ++y)
        await KV.put(
          `database_${y}`,
          (await KV.get(`database_${y + 1}`)) ?? {}
        );

      try {
        // deletes empty key which is now the last one
        await KV.delete(`database_${size}`);
      } catch (_) {}

      // decreases the size
      --size;

      // In theory one more key if database is empty, but doesn't work right now. TODO
      if (size === 0 || size === -1)
        try {
          await KV.delete(`databaseKeySize`);
        } catch (_) {}
      else await KV.put(`databaseKeySize`, size); // update size

      await dbKeyOrder(KV.namespace); // restart the whole process to check for a second empty key

      return true;
    }
  }

  return false; // changed nothing
}

// get the size in bytes of an object saved as JSON string
async function getSize(data: any): Promise<number> {
  return new TextEncoder().encode(JSON.stringify(data)).length;
}
