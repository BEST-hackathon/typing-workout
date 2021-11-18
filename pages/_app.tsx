import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react'
import { TypingCtxProvider } from '../context/TypingContext'
import { RandomTextPayload } from './api/random-text'

function MyApp({ Component, pageProps, router }: AppProps) {
    return (
        <TypingCtxProvider
            attemptDuration={30}
            fetchText={() =>
                fetch('/api/random-text')
                    .then<RandomTextPayload>((res) => res.json())
                    .then((res) => res.randomText)
            }
            onComplete={() => router.push('/analytics')}
        >
            <Component {...pageProps} />
        </TypingCtxProvider>
    )
}

export default MyApp
