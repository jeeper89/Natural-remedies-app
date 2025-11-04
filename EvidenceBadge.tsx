
import React from 'react'
const COLORS: Record<string, string> = {
  MetaAnalysis: 'border-green-700',
  RCT: 'border-green-600',
  Cohort: 'border-amber-600',
  Mixed: 'border-amber-700',
  Traditional: 'border-slate-500',
  ExpertConsensus: 'border-slate-500'
}
export default function EvidenceBadge({ level }: { level?: string }){
  const cls = COLORS[level || ''] || 'border-slate-400'
  return <span className={`text-xs px-2 py-0.5 rounded-full border ${cls}`}>Evidence: {level || 'N/A'}</span>
}
