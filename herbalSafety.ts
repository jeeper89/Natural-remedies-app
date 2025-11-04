
export type SafetyFlag = 'Pregnancy' | 'Breastfeeding' | 'Children' | 'Surgery' | 'Anticoagulants' | 'Thyroid' | 'Sedatives'

export function riskSummary(contras: string[]): { level: 'low'|'moderate'|'high', flags: SafetyFlag[] } {
  const map: Record<string, SafetyFlag> = {
    pregnancy: 'Pregnancy',
    anticoagulant: 'Anticoagulants',
    hyperthyroid: 'Thyroid',
    sedative: 'Sedatives'
  }
  const flags = (contras || []).map(c => {
    const k = Object.keys(map).find(key => c.toLowerCase().includes(key))
    return k ? map[k] : undefined
  }).filter(Boolean) as SafetyFlag[]
  const level = flags.length >= 2 ? 'high' : flags.length === 1 ? 'moderate' : 'low'
  return { level, flags }
}
