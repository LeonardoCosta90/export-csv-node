import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';
import { stringify } from 'csv-stringify';
import { createWriteStream } from 'node:fs';
import { sql } from './db/client';

async function run() {
  const cursor = sql`
    SELECT id, name
    FROM products
    WHERE price_in_cents > 1000
  `.cursor(10);

  const flatten = new Transform({
    objectMode: true,
    transform(chunk: any[], _enc, cb) {
      for (const row of chunk) this.push(row);
      cb();
    },
  });

  await pipeline(
    cursor,
    flatten,
    stringify({
      header: true,
      columns: [
        { key: 'id',   header: 'ID'   },
        { key: 'name', header: 'Name' },
      ],
    }),
    createWriteStream('./export.csv', { encoding: 'utf8' }),
  );

  await sql.end();
}

run().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
