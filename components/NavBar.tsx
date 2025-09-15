"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { ThemeToggle } from './ThemeToggle'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'

const links = [
  { href: '/', label: 'Eventos' },
  { href: '/organizer', label: 'Área do Organizador' },
  { href: '/tickets', label: 'Meus Convites' },
]

export function NavBar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  useEffect(() => {
    // close menu on route change
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  return (
    <header className="border-b border-slate-200 dark:border-slate-800">
      <div className="container flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-2 md:gap-6">
          <Link href="/" className="font-semibold">Open Ticket</Link>
          <button
            className="btn-ghost md:hidden"
            aria-label="Abrir menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(v => !v)}
          >
            <Menu size={18} />
          </button>
          <nav className="hidden md:flex items-center gap-2">
            {links.map(l => (
              <Link key={l.href} href={l.href} className={cn('btn-ghost text-sm', isActive(l.href) && 'bg-slate-100 dark:bg-slate-800')}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn-primary">Entrar</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <div className="container py-2 flex flex-col gap-1">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={cn('btn-ghost justify-start', isActive(l.href) && 'bg-slate-100 dark:bg-slate-800')}
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
