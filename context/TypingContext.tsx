import React, {
    createContext,
    FC,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'
import { useTimer } from 'react-timer-hook'
import { useAsyncFn } from 'react-use'

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

export type TypingCtxProps = {
    initialText: string
    fetchText: () => Promise<string>
    onComplete: (
        ctx: Pick<TypingContextType, 'words' | 'attemptDuration'>
    ) => void
    attemptDuration: number
}

const defaultTypingCtx: TypingContextType = {
    isLoadingText: false,
    activeWordIdx: 0,
    words: [],
    onCharInput: () => {},
    restart: () => {},
    secondsLeft: null,
    attemptDuration: 30,
    setAttemptDuration: () => {},
}

const TypingContext = createContext<TypingContextType>(defaultTypingCtx)

const getTimerDate = (seconds: number) => {
    const time = new Date()
    time.setSeconds(time.getSeconds() + seconds)
    return time
}

const useTypingState = ({
    fetchText,
    initialText,
    onComplete,
    attemptDuration: _attemptDuration,
}: TypingCtxProps): TypingContextType => {
    const [textReqVal, textReqFn] = useAsyncFn(fetchText, [], {
        loading: false,
        value: initialText,
    })

    const [attemptDuration, setAttemptDuration] = useState(_attemptDuration)
    const [activeWordIdx, setActiveWordIdx] = useState(
        defaultTypingCtx.activeWordIdx
    )
    const [words, setWords] = useState<TypingContextType['words']>(
        defaultTypingCtx.words
    )

    const { seconds, restart, resume, isRunning } = useTimer({
        autoStart: false,
        expiryTimestamp: getTimerDate(attemptDuration),
        onExpire: () => onComplete({ words, attemptDuration }),
    })

    useEffect(() => {
        if (!textReqVal.value) return
        setActiveWordIdx(defaultTypingCtx.activeWordIdx)
        setWords(
            textReqVal.value.split(' ').map((w) => ({
                original: w,
                typeHistory: [],
                wronglyTyped: false,
            }))
        )
    }, [textReqVal.value])

    const onCharInput = useCallback(
        (character: string) => {
            if (!seconds) return
            if (!isRunning && character.length === 1) resume()

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
        attemptDuration,
        secondsLeft: seconds,
        setAttemptDuration,
        restart: () => {
            textReqFn()
            restart(getTimerDate(attemptDuration), false)
        },
    }
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
