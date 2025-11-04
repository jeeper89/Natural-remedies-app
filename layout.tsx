
import React from 'react'
import Link from 'next/link'
import './globals.css'

export const metadata = { title: 'Natural Healing Companion', description: 'Herbs, recipes & daily regimens' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="max-w-4xl mx-auto p-6">
        <nav className="flex gap-4 mb-6">
          <Link href="/">Home</Link>
          <Link href="/herbs">Herbs</Link>
          <Link href="/recipes">Recipes</Link>
          <Link href="/regimens">Regimens</Link>
          <Link href="/track">Track</Link>
          <Link href="/pantry">Pantry</Link>
          <Link href="/submit">Submit</Link>
          <Link href="/admin/moderation">Moderation</Link>
          <Link href="/profile">Profile</Link>
        </nav>
        <main>{children}</main>
        <footer className="mt-10 text-xs text-gray-500">
          <p>Educational only. Not medical advice.</p>
        </footer>
      </body>
    </html>
  )
}
