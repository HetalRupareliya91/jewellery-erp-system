# Jewellery ERP System

Business software for a jewellery shop and workshop: gold stock by purity, karigar job work,
GST billing and accounts — Node.js/Express + SQLite API with a React (Vite) front end.

## Modules

| Module | What it covers |
| --- | --- |
| **Gold & inventory** | Stock by purity (24K/22K/18K…), gross/stone/net/fine weight, daily gold rates, stock valuation, wastage, melting loss and metal adjustments |
| **Production & job work** | Production orders and bills of materials, raw gold issue to karigars, finished jewellery receipt, wastage allowance, making charges, QC, production costing |
| **Sales, purchase & GST** | Barcode billing, sales/purchase invoices, CGST+SGST / IGST by place of supply, tax invoice / bill of supply / estimate, credit and debit notes, customer orders |
| **Accounting & reports** | Cash/bank accounts, receipts and payments, gold metal ledger, party balances, receivables/payables with ageing, profit margins, day book, monthly, financial-year and GST reports |

## Quick start

Requires Node.js 18+.

```bash
npm run install:all     # installs server and client dependencies
npm run seed            # optional demo data (purities, rates, parties, items)
npm run dev:server      # API on http://localhost:4000
npm run dev:client      # UI on http://localhost:5173 (proxies /api to the server)
npm test                # API test suite
```

Configuration is read from environment variables; see `server/.env.example`
(with Node 20.6+ you can run `node --env-file=.env src/server.js`).

## Project layout

```
server/
  src/
    lib/            crud factory, validation, GST, pricing, numbering, metal ledger
    db/migrations/  one SQL file per table, applied in order on startup
    modules/<name>/ schema.js, service.js, routes.js (auto-mounted under /api)
  tests/            node:test + supertest, one in-memory database per file
client/
  src/components/   generic EntityPage, DataTable, forms
  src/pages/        one file per screen; exports `meta` and is auto-registered
docs/               architecture, module notes and API reference
```

## Documentation

- [Architecture](docs/architecture.md)
- [Gold & inventory](docs/inventory.md)
- [Production & job work](docs/production.md)
- [Sales, purchase & GST](docs/sales-gst.md)
- [Accounting & reports](docs/accounting.md)
- [API reference](docs/api.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
