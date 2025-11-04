
# Ingestion Agent (Books/PDF/Links → JSON)

This script ingests PDFs or URLs and emits structured JSON to `src/data/custom/` for review before merging into the DB.

## Usage
```bash
npm i -D ts-node typescript
npm i pdf-parse node-fetch@2 cheerio @mozilla/readability jsdom
npx ts-node tools/ingest/index.ts --in books/*.pdf --out src/data/custom
npx ts-node tools/ingest/index.ts --url https://www.example.com/monograph --out src/data/custom
```

## What it does
- Extracts text from PDFs (title, sections, dosage, precautions, interactions).
- Extracts article text from web pages (Readability) when a URL is provided.
- Runs simple patterns to map content into `{herbs[], recipes[], regimens[]}`.
- Writes `herbs.custom.json`, `recipes.custom.json`, `regimens.custom.json` for manual QA.
