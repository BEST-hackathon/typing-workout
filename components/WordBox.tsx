import React from 'react'
import { TypingContextType } from '../context/TypingContext'
import styles from '../styles/Typing.module.css'
import { CharBox } from './CharBox'

export const WordBox = ({
    word,
}: {
    word: TypingContextType['words'][number]
}) => {
    const originalChars = Array.from(word.original)
    let chars = [...(word.typeHistory.at(-1)?.characters || [])]
    const lengthDiff = originalChars.length - (chars?.length || 0)

    if (lengthDiff > 0) {
        chars.push(
            ...originalChars
                .slice(originalChars.length - lengthDiff)
                .map((c) => ({ value: c }))
        )
    }

    return (
        <div className={styles.word}>
            {chars.map((char, idx) => (
                <CharBox key={idx} character={char} />
            ))}
        </div>
    )
}
