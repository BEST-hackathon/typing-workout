import { createContext } from 'react'

export enum CharState {
    CORRECT,
    ERROR,
    ERROR_EXTRA,
}

export type Words = Array<{
    original: string
    wronglyTyped: boolean
    typeHistory: Array<{
        timestamp: Date
        characters: Array<{ value: string; state?: CharState }>
    }>
}>

export type TypingContextType = {
    isLoadingText: boolean
    activeWordIdx: number
    words: Words
    onCharInput: (character: string) => void
    restart: () => void
    secondsLeft: number | null
    attemptDuration: number
    setAttemptDuration: (to: number) => void
}

export const defaultTypingCtx: TypingContextType = {
    isLoadingText: false,
    activeWordIdx: 0,
    words: [],
    onCharInput: () => {},
    restart: () => {},
    secondsLeft: null,
    attemptDuration: 30,
    setAttemptDuration: () => {},
}

export const TypingContext = createContext<TypingContextType>(defaultTypingCtx)
