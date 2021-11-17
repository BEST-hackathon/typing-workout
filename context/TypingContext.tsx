import React, {
    createContext,
    FC,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'
import { useTimer } from 'react-timer-hook'
import { useAsyncFn, useAsyncRetry } from 'react-use'

export enum CharState {
    CORRECT,
    ERROR,
    ERROR_EXTRA,
}

export type TypingContextType = {
    isLoadingText: boolean
    activeWordIdx: number
    words: Array<{
        original: string
        wronglyTyped: boolean
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
    isLoadingText: false,
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
    fetchText,
    onComplete,
    secondsCount,
}: TypingCtxProps): TypingContextType => {
    const [textReqVal, textReqFn] = useAsyncFn(fetchText)

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

    const restartTyping = useCallback(async () => {
        const text = await textReqFn()
        setActiveWordIdx(defaultTypingCtx.activeWordIdx)
        setWords(
            text.split(' ').map((w) => ({
                original: w,
                typeHistory: [],
                wronglyTyped: false,
            }))
        )
        restart(getTimerDate(secondsCount), false)
        // eslint-disable-next-line
    }, [secondsCount])

    useEffect(() => {
        restartTyping()
    }, [restartTyping])

    const onCharInput = useCallback(
        (character: string) => {
            if (!seconds) return
            if (!isRunning) resume()

            const prevHistoryRecord = words[activeWordIdx].typeHistory.at(-1)

            const newHistoryRecord: TypingContextType['words'][number]['typeHistory'][number] =
                {
                    timestamp: new Date(Date.now()),
                    characters: [],
                }

            switch (character) {
                case 'Backspace':
                    newHistoryRecord.characters =
                        prevHistoryRecord?.characters.slice(0, -1) || []
                    break
                case ' ':
                    if (prevHistoryRecord?.characters.length) {
                        setActiveWordIdx((idx) =>
                            Math.min(idx + 1, words.length - 1)
                        )
                    }
                    return
                default:
                    //filter out Tab, Shift, etc
                    if (character.length > 1) return

                    const expectedChar =
                        words[activeWordIdx].original[
                            prevHistoryRecord?.characters.length || 0
                        ]

                    newHistoryRecord.characters = [
                        ...(prevHistoryRecord?.characters || []),
                        {
                            value: expectedChar || character,
                            state: !expectedChar
                                ? CharState.ERROR_EXTRA
                                : expectedChar === character
                                ? CharState.CORRECT
                                : CharState.ERROR,
                        },
                    ]
                    break
            }

            setWords(
                words.map((wordVal, idx) => {
                    if (idx === activeWordIdx) {
                        return {
                            ...wordVal,
                            wronglyTyped:
                                newHistoryRecord.characters.length <
                                    wordVal.original.length ||
                                newHistoryRecord.characters.some((c) =>
                                    [
                                        CharState.ERROR,
                                        CharState.ERROR_EXTRA,
                                        undefined,
                                    ].includes(c.state)
                                ),
                            typeHistory: [
                                ...wordVal.typeHistory,
                                {
                                    ...newHistoryRecord,
                                },
                            ],
                        }
                    }
                    return wordVal
                })
            )
        },
        [activeWordIdx, words, resume, seconds, isRunning]
    )

    return {
        words,
        isLoadingText: textReqVal.loading,
        onCharInput,
        activeWordIdx,
        secondsLeft: seconds,
        restart: restartTyping,
    }
}

type TypingCtxProps = {
    fetchText: () => Promise<string>
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
