import fs from 'fs';
import minimist from 'minimist';
import {Firestore} from '@google-cloud/firestore';
import * as serviceAccount from '../firebaseServiceAccount.json';

const firestore = new Firestore({
  projectId: serviceAccount.project_id,
  credentials: {
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key,
  }
});

const argv = minimist(process.argv.slice(2), { string: '_' });

type Db = {
  items: Array<{
    id: number;
    text: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    isBacklog: boolean;
    isCompleted: boolean;
    isDeleted: boolean;
    schedule: string | null;
    completedAt: string;
  }>
};

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

async function main() {
  const db: Db = JSON.parse(fs.readFileSync(argv._[0], 'utf-8'));
  await syncItems({db});
}

async function syncItems({db}: {db: Db}) {
  const batch = firestore.batch();
  const itemsCollection = firestore.collection('items');

  if ((await itemsCollection.limit(1).get()).size > 0) {
    console.log(`syncItems: collection isn't empty`);
    return;
  }

  for (const item of db.items) {
    const itemRef = itemsCollection.doc(`item-${item.id}`);
    batch.set(itemRef, item);
  }

  await batch.commit();
  console.log(`syncItems: inserted ${db.items.length} item(s)`);
}
