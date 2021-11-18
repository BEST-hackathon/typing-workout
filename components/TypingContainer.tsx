import React from 'react'
import { TypingBox } from './TypingBox'
import styles from '../styles/Typing.module.css'
import { useTypingCtx } from '../context/TypingContext'

export const TypingContainer = () => {
    const { restart, secondsLeft, setAttemptDuration } = useTypingCtx()

    const availableTimes = [15, 30, 45]

    return (
        <div className={styles.typingContainer}>
            <div className={styles.time}>
                <p>
                    {secondsLeft} (
                    {availableTimes.map((time, index, array) => (
                        <>
                            <a
                                key={index}
                                className={styles.timePick}
                                onClick={() => setAttemptDuration(time)}
                            >
                                {time}
                            </a>
                            {array.length - 1 !== index && ' | '}
                        </>
                    ))}
                    )
                </p>
            </div>
            <TypingBox />

            <div className={styles.restart} onClick={restart}>
                Restart
            </div>
        </div>
    )
}
