
export type RuleHit = { code: string; severity: 'low'|'moderate'|'high'; message: string }
const RULES = [
  { test: /pregnan|pregnancy|pregnant/i, code: 'PREG', severity: 'high', message: 'Avoid in pregnancy unless supervised.' },
  { test: /anticoag|warfarin|blood.thin/i, code: 'ANTICOAG', severity: 'moderate', message: 'May increase bleeding risk with anticoagulants.' },
  { test: /sedat|benzodiaz|cns.depress/i, code: 'SED', severity: 'moderate', message: 'May cause additive sedation with CNS depressants.' },
  { test: /hyperthy|thyroid/i, code: 'THY', severity: 'moderate', message: 'May affect thyroid function or interact with thyroid meds.' },
  { test: /gallstone|bile|biliary/i, code: 'GB', severity: 'moderate', message: 'Use caution with gallbladder disease or bile duct obstruction.' },
  { test: /surgery|pre-?op|operation/i, code: 'SURG', severity: 'moderate', message: 'Stop 1–2 weeks before surgery due to bleeding/anesthesia interactions.' },
  { test: /children|infant|pediatric/i, code: 'PED', severity: 'low', message: 'Dose and safety in children may differ; use pediatric guidance.' }
]
export function evaluateContraindications(texts: string[]): RuleHit[] {
  const joined = (texts || []).join(' | ')
  return RULES.filter(r => r.test.test(joined)).map(r => ({ code: r.code, severity: r.severity as any, message: r.message }))
}
