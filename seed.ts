
import { PrismaClient } from '@prisma/client'
import herbs from '../src/data/herbs.json'
import recipes from '../src/data/recipes.json'
import regimens from '../src/data/regimens.json'

const prisma = new PrismaClient()
async function main() {
  await prisma.user.upsert({ where: { email: 'demo@example.com' }, update: {}, create: { email: 'demo@example.com', name: 'Demo' } })
  for (const h of herbs as any[]) {
    await prisma.herb.upsert({
      where: { slug: h.slug },
      update: {},
      create: {
        slug: h.slug, commonName: h.commonName, latinName: h.latinName,
        uses: h.uses, preparations: h.preparations, dosage: h.dosage,
        safetyNotes: h.safetyNotes, contraindications: h.contraindications, evidenceLevel: h.evidenceLevel, sources: h.sources || []
      }
    })
  }
  for (const r of recipes as any[]) {
    const herb = await prisma.herb.findFirst({ where: { slug: (r as any).herbRef } })
    await prisma.recipe.upsert({
      where: { slug: r.slug },
      update: {},
      create: {
        slug: r.slug, title: r.title, description: r.description,
        instructions: r.instructions, ingredients: r.ingredients,
        targets: r.targets, evidenceLevel: r.evidenceLevel, sources: r.sources || [],
        herbId: herb?.id || null
      }
    })
  }
  for (const g of regimens as any[]) {
    await prisma.regimen.upsert({
      where: { slug: g.slug },
      update: {},
      create: {
        slug: g.slug, title: g.title, goal: g.goal,
        morning: g.morning, afternoon: g.afternoon, evening: g.evening,
        durationDays: g.durationDays, evidenceLevel: g.evidenceLevel, tags: g.tags, sources: g.sources || []
      }
    })
  }
  console.log('Seeded')
}
main().catch(e=>{ console.error(e); process.exit(1) }).finally(()=>prisma.$disconnect())
