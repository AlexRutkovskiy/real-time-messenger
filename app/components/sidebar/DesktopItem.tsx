'use client'

import clsx from "clsx"
import Link from "next/link"

interface DesktopItemProps {
  label: string;
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  active?: boolean;
  onClick?: () => void; 
}

export default function DesktopItem({
  label,
  href,
  icon: Icon,
  active,
  onClick
}: DesktopItemProps) {

  const handleClick = () => {
    if (onClick) {
      return onClick()
    }
  }

  return (
    <li onClick={handleClick}>
      <Link 
        href={href}
        className={clsx(`
          group flex gap-x-3 rounded-md p-3 text-sm
          leading-6 font-semibold  
          hover:text-black hover:bg-gray-100
        `,
        active ? "text-black bg-gray-100" : "text-gray-500"
        )}
      >
        <Icon className="h-6 w-6 shrink-0" />
        <span className="sr-only">{label}</span>
      </Link>
    </li>
  )
}