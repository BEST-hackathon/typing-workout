import React, { createContext, FC, useCallback, useContext, useState } from "react"

enum CharState { CORRECT, ERROR, EMPTY }

type TypingContextType = {
    originalWords: string[]
    words: Array<{
        typeHistory: Array<{ timestamp: Date, value: string, chartStates: CharState[] }>
    }>,
    onCharInput: (character: string) => void
}

const defaultValue = { words: [{ typeHistory: [] }], onCharInput: () => { }, originalWords: [] }

const TypingContext = createContext<TypingContextType>(defaultValue)

export const TypingCtxProvider: FC<{ words: string[] }> = ({ children, words }) => {
    const data = useTypingState(words);

    return (
        <TypingContext.Provider value={data}>{children}</TypingContext.Provider>
    )
}

const useTypingCtxt = () => useContext(TypingContext);

const useTypingState = (originalWords: string[]): TypingContextType => {
    const [words, setWords] = useState<TypingContextType["words"]>(defaultValue.words);

    const onCharInput = useCallback((character: string) => {

        const currentHistoryRecord = words.at(-1)!.typeHistory.at(-1)!

        let currentWordValue = currentHistoryRecord.value

        let currentCharStates = currentHistoryRecord.chartStates

        switch (character) {
            case "Backspace":
                currentWordValue = currentWordValue?.slice(0, -1)
                break;
            case " ":
                setWords(words => [...words, { typeHistory: [] }])
                break;
            default: {
                currentWordValue += character
                currentCharStates = originalWords[words.length - 1].charAt(currentWordValue.length) === character ? [...currentCharStates, CharState.CORRECT] : [...currentCharStates, CharState.ERROR]
                break;
            }
        }

        const historyRecord: TypingContextType["words"][number]["typeHistory"][number] = {
            timestamp: new Date(Date.now()),
            value: currentWordValue,
            chartStates: currentCharStates
        }

        setWords(words => words.map((wordVal, idx) => idx === words.length - 1 ? { ...wordVal, typeHistory: [...wordVal.typeHistory, historyRecord] } : wordVal))

    }, []);

    return { words, onCharInput, originalWords };

}
