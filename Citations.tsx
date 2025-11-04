
import React from 'react'
export default function Citations({ sources }: { sources?: string[] }){
  if(!sources?.length) return null
  return (
    <details className="mt-2">
      <summary className="cursor-pointer text-sm">Sources</summary>
      <ul className="list-disc list-inside text-xs">
        {sources.map((s, i)=>(<li key={i}><a href={s} target="_blank" rel="noreferrer">{s}</a></li>))}
      </ul>
    </details>
  )
}
