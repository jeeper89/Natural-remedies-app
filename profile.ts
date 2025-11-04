
'use client'
import React from 'react'

export type Profile = {
  meds: string[]
  conditions: string[]
  pregnancy: boolean
  surgerySoon: boolean
  children: boolean
}

const DEFAULT: Profile = {
  meds: [],
  conditions: [],
  pregnancy: false,
  surgerySoon: false,
  children: false,
}

export function useProfile() {
  const [profile, setProfile] = React.useState<Profile>(DEFAULT)
  React.useEffect(() => {
    const raw = localStorage.getItem('profile')
    setProfile(raw ? JSON.parse(raw) : DEFAULT)
  }, [])
  function save(next: Profile) {
    setProfile(next)
    localStorage.setItem('profile', JSON.stringify(next))
  }
  return { profile, save }
}
