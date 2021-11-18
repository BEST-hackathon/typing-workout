import { CharState, TypingContextType } from '../context/TypingContext'

export const calculateRangedCharactersCount = (
    words: TypingContextType['words'],
    range: { from: Date; to: Date },
    shouldBeCorrect: boolean
) => {
    return words
        .map((w) => {
            // If no type history for word, then word hasn't been typed
            if (!w.typeHistory.length) return 0

            // Filter type histories, that are in range
            const lastTypeHistory = w.typeHistory
                .filter(
                    (h) => range.from <= h.timestamp && h.timestamp <= range.to
                )
                .at(-1)
            if (!lastTypeHistory) return 0

            // Get last characters of type history, always defined, because lastTypeHistory is defined
            const lastCharacters = lastTypeHistory.characters.at(-1)!

            // If last characters are not correct, then set it to 0 (to calculate WPM)
            if (shouldBeCorrect) {
                if (lastCharacters.state === CharState.CORRECT) return 0
            }

            // Return how many characters do the last ranged word has
            return lastCharacters.value.length
        })
        .reduce((acc, el) => acc + el, 0)
}
