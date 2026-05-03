import React from 'react'

interface TitleProps {
  children: React.ReactNode
  level?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}

export function Title({ children, level = 1, className = '' }: TitleProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements

  const styles: Record<number, string> = {
    1: 'text-4xl font-bold',
    2: 'text-3xl font-bold',
    3: 'text-2xl font-semibold',
    4: 'text-xl font-semibold',
    5: 'text-lg font-medium',
    6: 'text-base font-medium'
  }

  return (
    <Tag className={`text-gray-900 ${styles[level]} ${className}`}>
      {children}
    </Tag>
  )
}
