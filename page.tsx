
'use client'
import React from 'react'

export default function ModerationPage(){
  const [items, setItems] = React.useState<any[]>([])
  async function load(){ const r = await fetch('/api/moderate'); const j = await r.json(); setItems(j.items) }
  React.useEffect(()=>{ load() }, [])

  async function action(id:number, action:'approve'|'reject'){
    await fetch('/api/moderate', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, action }) })
    load()
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-3">Moderation Queue</h2>
      {!items.length ? <p className="text-sm">No pending submissions.</p> : null}
      <ul className="mt-2">
        {items.map((r:any)=>(
          <li key={r.id} className="border rounded-xl p-3 mb-2">
            <div className="font-medium">{r.title}</div>
            {r.targets?.length ? <div className="text-xs">Targets: {r.targets.join(', ')}</div> : null}
            <div className="text-sm">{r.instructions}</div>
            <div className="mt-2 flex gap-2">
              <button className="btn" onClick={()=>action(r.id, 'approve')}>Approve</button>
              <button className="btn" onClick={()=>action(r.id, 'reject')}>Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
