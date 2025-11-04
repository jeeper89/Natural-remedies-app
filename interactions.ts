
import type { Profile } from './profile'

type Interaction = { code: string; severity: 'low'|'moderate'|'high'; message: string }
const MED_RULES: { test: RegExp; code: string; severity: Interaction['severity']; message: string }[] = [
  { test: /(warfarin|coumadin|apixaban|eliquis|rivaroxaban|xarelto|dabigatran|pradaxa)/i, code: 'ANTICOAG', severity: 'high', message: 'Potential bleeding risk with anticoagulants.' },
  { test: /(benzodiazepine|alprazolam|xanax|lorazepam|diazepam|clonazepam|zolpidem|ambien|trazodone)/i, code: 'SED', severity: 'moderate', message: 'Additive sedation with CNS depressants.' },
  { test: /(levothyroxine|synthroid|thyroxine)/i, code: 'THY', severity: 'moderate', message: 'May affect thyroid medication; separate dosing and monitor.' }
]

export function checkInteractions(profile: Profile, herb: any): Interaction[] {
  const hits: Interaction[] = []
  const medsLine = (profile.meds || []).join(' | ')
  for(const r of MED_RULES){
    if(r.test.test(medsLine)){
      const c = (herb.contraindications || []).join(' ').toLowerCase() + ' ' + (herb.safetyNotes || '').toLowerCase()
      if(r.code==='ANTICOAG' && /anticoagul|bleed|thin/.test(c)) hits.push({ code: r.code, severity: r.severity, message: r.message })
      if(r.code==='SED' && /sedat|drows/.test(c)) hits.push({ code: r.code, severity: r.severity, message: r.message })
      if(r.code==='THY' && /thyroid/.test(c)) hits.push({ code: r.code, severity: r.severity, message: r.message })
    }
  }
  if(profile.pregnancy && /(pregnan|pregnancy)/i.test((herb.contraindications||[]).join(' '))) {
    hits.push({ code: 'PREG', severity: 'high', message: 'Avoid in pregnancy unless supervised.' })
  }
  if(profile.surgerySoon && /(surgery|pre-?op)/i.test((herb.contraindications||[]).join(' '))) {
    hits.push({ code: 'SURG', severity: 'moderate', message: 'Stop 1–2 weeks before surgery.' })
  }
  if(profile.children && /(children|pediatric|infant)/i.test((herb.contraindications||[]).join(' '))) {
    hits.push({ code: 'PED', severity: 'low', message: 'Dose and safety differ in children; seek pediatric guidance.' })
  }
  return hits
}
