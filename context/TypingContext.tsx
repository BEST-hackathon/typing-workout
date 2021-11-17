import React, {
    createContext,
    FC,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'
import { useTimer } from 'react-timer-hook'

export enum CharState {
    CORRECT,
    ERROR,
}

export type TypingContextType = {
    activeWordIdx: number
    words: Array<{
        original: string
        typeHistory: Array<{
            timestamp: Date
            characters: Array<{ value: string; state?: CharState }>
        }>
    }>
    onCharInput: (character: string) => void
    restart: () => void
    secondsLeft: number | null
}

const defaultTypingCtx: TypingContextType = {
    activeWordIdx: 0,
    words: [],
    onCharInput: () => {},
    restart: () => {},
    secondsLeft: null,
}

const TypingContext = createContext<TypingContextType>(defaultTypingCtx)

const getTimerDate = (seconds: number) => {
    const time = new Date()
    time.setSeconds(time.getSeconds() + seconds)
    return time
}

const useTypingState = ({
    text: originalText,
    onComplete,
    secondsCount,
}: TypingCtxProps): TypingContextType => {
    const { seconds, restart, resume, isRunning } = useTimer({
        autoStart: false,
        expiryTimestamp: getTimerDate(secondsCount),
        onExpire: onComplete,
    })

    const [activeWordIdx, setActiveWordIdx] = useState(
        defaultTypingCtx.activeWordIdx
    )
    const [words, setWords] = useState<TypingContextType['words']>(
        defaultTypingCtx.words
    )

    const restartTyping = useCallback(() => {
        setActiveWordIdx(defaultTypingCtx.activeWordIdx)
        setWords(
            originalText
                .split(' ')
                .map((w) => ({ original: w, typeHistory: [] }))
        )
        restart(getTimerDate(secondsCount), false)
        // eslint-disable-next-line
    }, [originalText, secondsCount])

    useEffect(restartTyping, [restartTyping])

    const onCharInput = useCallback(
        (character: string) => {
            if (!seconds) return
            if (!isRunning) resume()

            const prevHistoryRecord = words[activeWordIdx].typeHistory.at(-1)

            const newHistoryRecord: TypingContextType['words'][number]['typeHistory'][number] =
                { timestamp: new Date(Date.now()), characters: [] }

            switch (character) {
                case 'Shift':
                    break
                case 'Backspace':
                    newHistoryRecord.characters =
                        prevHistoryRecord?.characters.slice(0, -1) || []
                    break
                case ' ':
                    if (prevHistoryRecord) {
                        setActiveWordIdx((idx) =>
                            Math.min(idx + 1, words.length - 1)
                        )
                    }
                    return
                default: {
                    const expectedChar =
                        words[activeWordIdx].original[
                            prevHistoryRecord?.characters.length || 0
                        ]

                    newHistoryRecord.characters = [
                        ...(prevHistoryRecord?.characters || []),
                        {
                            value: expectedChar || character,
                            state:
                                expectedChar === character
                                    ? CharState.CORRECT
                                    : CharState.ERROR,
                        },
                    ]
                    break
                }
            }

            setWords(
                words.map((wordVal, idx) =>
                    idx === activeWordIdx
                        ? {
                              ...wordVal,
                              typeHistory: [
                                  ...wordVal.typeHistory,
                                  newHistoryRecord,
                              ],
                          }
                        : wordVal
                )
            )
        },
        [activeWordIdx, words, resume, seconds, isRunning]
    )

    return {
        words,
        onCharInput,
        activeWordIdx,
        secondsLeft: seconds,
        restart: restartTyping,
    }
}

type TypingCtxProps = {
    text: string
    onComplete: () => void
    secondsCount: number
}

export const TypingCtxProvider: FC<TypingCtxProps> = ({
    children,
    ...props
}) => {
    const data = useTypingState(props)

    return (
        <TypingContext.Provider value={data}>{children}</TypingContext.Provider>
    )
}

export const useTypingCtx = () => useContext(TypingContext)
