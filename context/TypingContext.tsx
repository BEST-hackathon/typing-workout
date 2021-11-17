import React, {
    createContext,
    FC,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'

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
}

const defaultTypingCtx: TypingContextType = {
    activeWordIdx: 0,
    words: [],
    onCharInput: () => {},
}

const TypingContext = createContext<TypingContextType>(defaultTypingCtx)

const useTypingState = (originalText: string): TypingContextType => {
    const [activeWordIdx, setActiveWordIdx] = useState(
        defaultTypingCtx.activeWordIdx
    )
    const [words, setWords] = useState<TypingContextType['words']>(
        defaultTypingCtx.words
    )
    console.log({ words, activeWordIdx })

    useEffect(() => {
        setActiveWordIdx(defaultTypingCtx.activeWordIdx)
        setWords(
            originalText
                .split(' ')
                .map((w) => ({ original: w, typeHistory: [] }))
        )
    }, [originalText])

    const onCharInput = useCallback(
        (character: string) => {
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
                            Math.min(idx + 1, words.length)
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
                            value: expectedChar,
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
        [activeWordIdx, words]
    )

    return { words, onCharInput, activeWordIdx }
}

export const TypingCtxProvider: FC<{ text: string }> = ({ children, text }) => {
    const data = useTypingState(text)

    return (
        <TypingContext.Provider value={data}>{children}</TypingContext.Provider>
    )
}

export const useTypingCtx = () => useContext(TypingContext)
