import React, { useEffect, useRef } from 'react'
import { useTypingCtx } from '../context/TypingContext'
import styles from '../styles/Typing.module.css'
import cs from 'classnames'
import { WordBox } from './WordBox'

export const TypingBox = () => {
    const { onCharInput, words, activeWordIdx, isLoadingText } = useTypingCtx()
    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        const input = inputRef.current
        if (!input) return

        input.focus()

        const handler = ({ key }: { key: string }) => onCharInput(key)
        input.addEventListener('keydown', handler)

        return () => input.removeEventListener('keydown', handler)
    }, [onCharInput])

    return (
        <>
            <input ref={inputRef} className={styles.wordsInput} />
            <div
                className={cs(styles.wordsBox, {
                    [styles.blurred]: isLoadingText,
                })}
                onClick={() => inputRef.current?.focus()}
            >
                {words.map((word, key) => (
                    <WordBox
                        key={key}
                        word={word}
                        isActive={key === activeWordIdx}
                    />
                ))}
            </div>
        </>
    )
}
