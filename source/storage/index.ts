import { createRxDatabase, RxDatabase } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/dexie';
import tagSchema from './tag.schema';

let _smartBookmarsDatabase: RxDatabase;

export default async function getDatabase() {
  if (_smartBookmarsDatabase) {
    return _smartBookmarsDatabase;
  }

  _smartBookmarsDatabase = await createRxDatabase({
    name: 'smartbookmarks',
    storage: getRxStorageDexie(),
  });

  await _smartBookmarsDatabase.addCollections({
    tags: {
      schema: tagSchema,
    },
  });

  _smartBookmarsDatabase.tags.$.subscribe(async () => {
    console.log(
      await _smartBookmarsDatabase.tags
        .find()
        .exec()
        .then((tags) => {
          const tagNames = tags.map((doc) => doc.get('name'));
          console.log(tagNames);
        }),
    );
  });

  return _smartBookmarsDatabase;
}

export async function addTag(tag: string) {
  const smartBookmarsDatabase = await getDatabase();
  const newTag = await smartBookmarsDatabase.tags.insert({
    name: tag,
  });
  return newTag;
}
