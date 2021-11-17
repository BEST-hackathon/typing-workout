import React, { createContext, FC, useContext, useEffect, useRef, useState } from 'react'
import styles from '../styles/Typing.module.css'
import { WordBox } from './WordBox'


export const TypingBox = ({ fullText }: { fullText: string }) => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const words = fullText.split(' ')
    const [errorPostion, setErrorPosition] = useState<number | null>(null)
    const [currPosition, setCurPosition] = useState<number>(0)

    useEffect(() => {
        inputRef.current?.focus()
        const handler = ({ key }: { key: string }) => {
            if (fullText.charAt(currPosition) === key) {
                console.log('hey')
                setCurPosition((pos) => pos + 1)
            } else {
                setErrorPosition(currPosition)
            }
        }
        document.addEventListener('keydown', handler)

        return () => document.removeEventListener('keydown', handler)
    }, [currPosition, fullText])

    return (
        <>
            <input ref={inputRef} className={styles.wordsInput} />
            <div className={styles.wordsBox}>
                {words.map((word, key) => (
                    <WordBox key={key} value={word} />
                ))}
            </div>
        </>
    )
}
