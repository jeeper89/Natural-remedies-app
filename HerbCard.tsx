
import React from 'react'
import EvidenceBadge from '@/components/EvidenceBadge'
import { evaluateContraindications } from '@/lib/contraindications'
import Citations from '@/components/Citations'
import { useProfile } from '@/lib/profile'
import { checkInteractions } from '@/lib/interactions'

export default function HerbCard({ herb }: { herb: any }) {
  const hits = evaluateContraindications(herb.contraindications || [])
  const { profile } = useProfile()
  const ix = checkInteractions(profile, herb)
  return (
    <div className="border rounded-2xl p-4 shadow">
      <h3 className="text-xl font-semibold">{herb.commonName}</h3>
      <div className="mt-1"><EvidenceBadge level={herb.evidenceLevel} /></div>
      <p className="text-sm italic">{herb.latinName}</p>
      <p className="mt-2 text-sm"><b>Uses:</b> {herb.uses.join(', ')}</p>
      {herb.dosage && <p className="text-sm"><b>Dosage:</b> {herb.dosage}</p>}
      {herb.safetyNotes && <p className="text-sm"><b>Safety:</b> {herb.safetyNotes}</p>}
      {herb.contraindications?.length ? <p className="text-sm"><b>Contraindications:</b> {herb.contraindications.join(', ')}</p> : null}
      {hits.length ? (
        <div className="mt-2 rounded-xl border border-red-300 bg-red-50 p-2">
          <p className="text-xs font-semibold">Safety Alerts</p>
          <ul className="list-disc list-inside text-xs">
            {hits.map((h:any, i:number)=>(<li key={i}>{h.message}</li>))}
          </ul>
        </div>
      ) : null}
      {ix.length ? (
        <div className="mt-2 rounded-xl border border-amber-300 bg-amber-50 p-2">
          <p className="text-xs font-semibold">Personalized Interaction Warnings</p>
          <ul className="list-disc list-inside text-xs">
            {ix.map((h:any, i:number)=>(<li key={i}>{h.message}</li>))}
          </ul>
        </div>
      ) : null}
      <Citations sources={herb.sources} />
    </div>
  )
}
