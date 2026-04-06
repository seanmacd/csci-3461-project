'use client'

import {Button} from '@mantine/core'
import Link from 'next/link'
import {usePathname} from 'next/navigation'

export function NavLink({href, label}: {href: string; label: string}) {
  const pathname = usePathname()
  const variant = pathname === href ? 'filled' : 'default'

  return (
    <Button component={Link} variant={variant} href={href} fullWidth>
      {label}
    </Button>
  )
}
