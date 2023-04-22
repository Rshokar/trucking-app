import { ReactNode } from 'react'
export interface AnimationProps {
    show: boolean
    close?: () => void,
    children: ReactNode,
    VH?: number
}