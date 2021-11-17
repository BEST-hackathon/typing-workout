import React from 'react'
import { TypingContextType } from '../context/TypingContext'
import cs from 'classnames'
import styles from '../styles/Typing.module.css'
import { CharBox } from './CharBox'

export const WordBox = ({
    word,
    isActive,
}: {
    isActive: boolean
    word: TypingContextType['words'][number]
}) => {
    const originalChars = Array.from(word.original)
    const typedChars = word.typeHistory.at(-1)?.characters || []
    const chars = [
        ...typedChars,
        ...originalChars.slice(typedChars.length).map((c) => ({ value: c })),
    ]

    return (
        <div
            className={cs(styles.word, {
                [styles.error]: !isActive && word.wronglyTyped,
            })}
        >
            {chars.map((char, idx) => (
                <CharBox key={idx} character={char} />
            ))}
        </div>
    )
}
