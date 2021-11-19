import React from 'react'
import { TypingBox } from './TypingBox'
import styles from '../styles/Typing.module.css'
import { useTypingCtx } from '../context/TypingContext/provider'

export const TypingContainer = () => {
    const { restart, secondsLeft } = useTypingCtx()

    return (
        <div className={styles.typingContainer}>
            <div className={styles.time}>{secondsLeft}</div>

            <TypingBox />

            <div className={styles.restart} onClick={restart}>
                Restart
            </div>
        </div>
    )
}
