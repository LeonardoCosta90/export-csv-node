# Export‑CSV Node – README

> Pequena **PoC** em **Node.js + TypeScript** que populariza um banco **PostgreSQL**, gera 200 k registros fictícios e exporta um recorte para **CSV** via _streaming_ sem estourar memória.

## 🛠️ Stack de Tecnologias

| Camada | Lib / Tecnologia | Por que? |
| ------ | ---------------- | -------- |
| **Runtime** | **Node.js 22** | Suporte nativo a *top‑level await*, ESM e `node:stream/promises`. |
| **Linguagem** | **TypeScript 5** | `strict` mode para segurança total de tipos. |
| **Banco** | **PostgreSQL 16** | Cursores de streaming e tipos numéricos precisos. |
| **Client SQL** | [`postgres`](https://github.com/porsager/postgres) | Driver 100 % JS, cursor `.cursor(n)`, pool embutido e _tagged template_ SQL. |
| **Gerador de dados** | [`@faker-js/faker`](https://fakerjs.dev/) | Popula tabelas rapidamente com dados realistas (`pt_BR`). |
| **CSV** | [`csv-stringify`](https://csv.js.org/stringify/) | Serialização assíncrona em *object‑mode*. |
| **Streaming** | `node:stream/promises` | `pipeline()` com _back‑pressure_. |
| **Runner TS** | [`tsx`](https://github.com/esbuild-kit/tsx) | Executa TS direto no Node com Source‑Maps. |
| **Qualidade** | ESLint Flat, Prettier | Lint + format on save. |

## 📂 Estrutura de Pastas

```text
src/
 ├─ db/
 │   ├─ client.ts      # instancia do driver postgres
 │   └─ seed.ts        # cria + popula tabela products
 ├─ export.ts          # exportação para CSV
 └─ types.d.ts         # tipagens globais (opcional)
.env.local             # credenciais
eslint.config.js        # Flat Config ESM
tsconfig.json           # strict + NodeNext + paths
README.md
```

## 🚀 Setup Rápido

```bash
# clone
git clone https://github.com/LeonardoCosta90/export-csv-node && cd export-csv-node

# dependências
pnpm install   # ou npm / yarn

# banco
docker run -d --name pg   -e POSTGRES_PASSWORD=postgres   -p 5432:5432 postgres:16

# variáveis
cp .env.example .env.local
# edite DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres

# popular (200 k registros)
pnpm seed

# exportar para CSV
pnpm export     # gera ./export.csv (~10 MB)
```

> **Performance:** ~150 k linhas/seg em máquina comum (~500 MB RAM livre) graças a cursores + back‑pressure.

## 📝 Scripts NPM

| Script | Descrição |
| ------ | --------- |
| `seed`   | Popula 200 k produtos. |
| `export` | Gera `export.csv` com `price_in_cents > 1000`. |
| `lint`   | ESLint Flat config. |
| `dev`    | `tsx watch src/export.ts` – hot‑reload. |

## ⚙️ Detalhes de Implementação

### Cursores

```ts
const cursor = sql`
  SELECT id, name
  FROM products
  WHERE price_in_cents > 1000
`.cursor(10); // 10 linhas por fetch
```

### Stream → CSV

```ts
await pipeline(
  cursor,
  flatten,
  stringify({ header: true, columns: [...] }),
  createWriteStream('./export.csv', { encoding: 'utf8' }),
);
```

## 🗺️ Roadmap

- [ ] Parametrizar tamanho do cursor (`--batch`)
- [ ] Seleção dinâmica de colunas (`--columns`)
- [ ] Compressão (`export.csv.gz`)
- [ ] Docker multi‑stage

## 🪪 Licença

MIT © 2025.
