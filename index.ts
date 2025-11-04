
// Minimal ingestion scaffold: PDF/URL → structured JSON
import fs from 'fs'
import path from 'path'
import pdf from 'pdf-parse'
import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import { JSDOM } from 'jsdom'
// @ts-ignore
import { Readability } from '@mozilla/readability'

type Herb = { slug: string; commonName: string; latinName?: string; uses: string[]; preparations: string[]; dosage?: string; safetyNotes?: string; contraindications: string[]; evidenceLevel: string; sources?: string[] }
type Recipe = { slug: string; title: string; description?: string; instructions: string; ingredients: string[]; targets: string[]; evidenceLevel: string; sources?: string[] }
type Regimen = { slug: string; title: string; goal: string; morning: string[]; afternoon: string[]; evening: string[]; durationDays: number; evidenceLevel: string; tags: string[]; sources?: string[] }

function slugify(s: string){ return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') }

async function extractFromPDF(filePath: string): Promise<string> {
  const data = await pdf(fs.readFileSync(filePath))
  return data.text || ''
}

async function extractFromURL(url: string): Promise<string> {
  const res = await fetch(url); const html = await res.text()
  const dom = new JSDOM(html); const reader = new Readability(dom.window.document)
  const article = reader.parse()
  return (article?.textContent || '').trim()
}

function naiveParse(text: string, sourceRef: string){
  const herbs: Herb[] = []
  const blocks = text.split(/\n\s*\n/)
  for(const b of blocks){
    const m = b.match(/^(?<name>[A-Z][A-Za-z\s-]{3,})\s*\((?<latin>[A-Z][a-z]+\s+[a-z]+)\)/m)
    if(m){
      const name = m.groups?.name?.trim() || 'Unknown'
      const latin = m.groups?.latin?.trim()
      herbs.push({ slug: slugify(name), commonName: name, latinName: latin, uses: [], preparations: [], dosage: undefined, safetyNotes: undefined, contraindications: [], evidenceLevel: 'Traditional', sources: [sourceRef] })
    }
  }
  return { herbs, recipes: [] as Recipe[], regimens: [] as Regimen[] }
}

async function main(){
  const args = process.argv.slice(2)
  const outIdx = args.indexOf('--out')
  const outDir = outIdx>=0 ? args[outIdx+1] : 'src/data/custom'
  const inIdx = args.indexOf('--in')
  const urlIdx = args.indexOf('--url')

  fs.mkdirSync(outDir, { recursive: true })

  let text = ''
  if(inIdx>=0){
    const pattern = args[inIdx+1]
    const dir = path.dirname(pattern)
    const files = fs.readdirSync(dir).filter(f=>f.toLowerCase().endsWith('.pdf')).map(f=>path.join(dir, f))
    for(const f of files){ text += '\n\n' + await extractFromPDF(f) }
  } else if(urlIdx>=0){
    const url = args[urlIdx+1]
    text = await extractFromURL(url)
  } else {
    console.error('Provide --in <dir-of-pdfs/*.pdf> or --url <http>'); process.exit(1)
  }

  const { herbs, recipes, regimens } = naiveParse(text, urlIdx>=0? args[urlIdx+1]: 'local-pdf')
  fs.writeFileSync(path.join(outDir, 'herbs.custom.json'), JSON.stringify(herbs, null, 2))
  fs.writeFileSync(path.join(outDir, 'recipes.custom.json'), JSON.stringify(recipes, null, 2))
  fs.writeFileSync(path.join(outDir, 'regimens.custom.json'), JSON.stringify(regimens, null, 2))
  console.log('Wrote custom JSON to', outDir)
}

main().catch(e=>{ console.error(e); process.exit(1) })
