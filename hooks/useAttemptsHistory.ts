import { useLocalStorage } from 'react-use'
import { TypingCtxProps, CharState } from '../context/TypingContext'

type AttemptStats = {
    wpm: number
    raw: number
    chartsData: Array<{ wpm: number; raw: number }>
    attemptDuration: number
}

type AttemptsHistoryRecord = {
    timestamp: number
    record: AttemptStats
}

export const useAttemptsHistory = (): {
    addAttempt: TypingCtxProps['onComplete']
    history: AttemptsHistoryRecord[]
    latestAttempt: AttemptsHistoryRecord | undefined
} => {
    const [history = [], setHistory] = useLocalStorage<AttemptsHistoryRecord[]>(
        'attemptsHistory',
        []
    )

    return {
        addAttempt: ({ attemptDuration, words }) => {
            const attemptStart = words[0].typeHistory[0].timestamp.getTime()

            const secondToData = Array.from({ length: attemptDuration }).reduce<
                Record<
                    number,
                    { allCharsCount: number; correctCharsCount: number }
                >
            >((acc, _, idx) => {
                acc[idx + 1] = { allCharsCount: 0, correctCharsCount: 0 }
                return acc
            }, {})

            words.forEach((word) =>
                word.typeHistory.forEach(
                    (historyEntry, historyEntryIdx, history) => {
                        const secondsFromStart = Math.floor(
                            (historyEntry.timestamp.getTime() - attemptStart) /
                                1000
                        )
                        const prevHistoryEntry = history[historyEntryIdx - 1]

                        // when user typed new character (not backslash)
                        if (
                            (prevHistoryEntry?.characters.length || 0) <
                            historyEntry.characters.length
                        ) {
                            const newChar = historyEntry.characters.at(-1)
                            if (newChar?.state === CharState.CORRECT) {
                                secondToData[secondsFromStart + 1]
                                    .correctCharsCount++
                            }
                            secondToData[secondsFromStart + 1].allCharsCount++
                        }
                    }
                )
            )

            const chartsData = Object.entries(secondToData)
                .sort((a, b) => +b[0] - +a[0])
                .map(([_, data]) => ({
                    wpm: (data.correctCharsCount * 60) / 5,
                    raw: (data.allCharsCount * 60) / 5,
                }))

            const record = {
                wpm:
                    words.filter((w) => !w.wronglyTyped && w.typeHistory.length)
                        .length *
                    (60 / attemptDuration),
                raw:
                    words.filter((w) => w.typeHistory.length).length *
                    (60 / attemptDuration),
                chartsData,
                attemptDuration,
            }

            setHistory([...history, { timestamp: Date.now(), record }])
        },
        history,
        latestAttempt: history?.at(-1),
    }
}
