import React from 'react'
import styles from '../styles/Typing.module.css'
import { CharBox } from './CharBox'

export const WordBox = ({ value }: { value: string }) => {
    const chars = value.split('')
    return (
        <div className={styles.charsBox}>
            {chars.map((char, idx) => (
                <CharBox key={idx} value={char} />
            ))}
        </div>
    )
}
