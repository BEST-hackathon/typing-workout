import React from 'react'
import cs from 'classnames'
import styles from '../styles/Typing.module.css'
import { CharBox } from './CharBox'
import { TypingContextType } from '../context/TypingContext/context'
import { getLast } from '../utils/getLast'

export const WordBox = ({
    word,
    isActive,
}: {
    isActive: boolean
    word: TypingContextType['words'][number]
}) => {
    const originalChars = Array.from(word.original)
    const typedChars = getLast(word.typeHistory)?.characters || []
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
