import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react'
import { TypingCtxProvider, useTypingCtx } from '../context/TypingContext'
import { RandomTextPayload } from './api/random-text'
import { useTypingAttempts } from '../hooks/useTypingAttempts'
import { useTypingSpeed } from '../hooks/useTypingSpeed'

function MyApp({ Component, pageProps, router }: AppProps) {
    const [value, setValue] = useTypingAttempts()
    const typingSpeed = useTypingSpeed()

    return (
        <TypingCtxProvider
            attemptDuration={30}
            fetchText={() =>
                fetch('/api/random-text')
                    .then<RandomTextPayload>((res) => res.json())
                    .then((res) => res.randomText)
            }
            onComplete={(words, attemptDuration) => {
                setValue({
                    ...value,
                    [Date.now()]: typingSpeed(words, attemptDuration),
                })

                router.push('/analytics')
            }}
        >
            <Component {...pageProps} />
        </TypingCtxProvider>
    )
}

export default MyApp
