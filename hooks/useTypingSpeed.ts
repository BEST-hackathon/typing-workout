import { TypingSpeed, Words } from '../types'

export const useTypingSpeed = (): ((
    words: Words,
    attemptDuration: number
) => TypingSpeed) => {
    return (words, attemptDuration) => [
        words.filter((w) => !w.wronglyTyped && w.typeHistory.length).length *
            (60 / attemptDuration),
        words.filter((w) => w.typeHistory.length).length *
            (60 / attemptDuration),
    ]
}
