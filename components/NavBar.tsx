"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { ThemeToggle } from './ThemeToggle'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'Eventos' },
  { href: '/organizer', label: 'Área do Organizador' },
  { href: '/tickets', label: 'Meus Convites' },
]

export function NavBar() {
  const pathname = usePathname()
  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }
  return (
    <header className="border-b border-slate-200 dark:border-slate-800">
      <div className="container flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold">Open Ticket</Link>
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
    </header>
  )
}
