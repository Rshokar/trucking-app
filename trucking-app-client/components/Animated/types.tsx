import { ReactNode } from 'react'
export interface AnimationProps {
    show?: boolean
    close?: () => any,
    onAnimationEnd?: () => any,
    onAnimationBegin?: () => any,
    children: ReactNode,
    VH?: number
}