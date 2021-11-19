export enum CharState {
    CORRECT,
    ERROR,
    ERROR_EXTRA,
}

export type TypingSpeed = [number, number]

export type Words = Array<{
    original: string
    wronglyTyped: boolean
    typeHistory: Array<{
        timestamp: Date
        characters: Array<{ value: string; state?: CharState }>
    }>
}>