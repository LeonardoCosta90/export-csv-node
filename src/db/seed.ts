import { sql } from "./client";
import { faker } from "@faker-js/faker/locale/pt_BR";

await sql`
  CREATE TABLE IF NOT EXISTS products (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    description   TEXT,
    price_in_cents NUMERIC(10,2) NOT NULL,
    created_at    TIMESTAMP DEFAULT NOW()
  )
`;

await sql`TRUNCATE TABLE products`;

for (const _i of Array.from({ length: 20 })) {
  const products = Array.from({ length: 10_000 }).map(() => ({
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price_in_cents: Number(
      faker.commerce.price({ min: 100, max: 10_000, dec: 0 })
    ),
  }));
  await sql`INSERT INTO products ${sql(products)}`;
  console.log("Inserted 10_000 products");
}

sql.end();
