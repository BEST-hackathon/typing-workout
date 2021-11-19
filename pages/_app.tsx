import { AppProps } from 'next/dist/shared/lib/router/router'
import React from 'react'
import { TypingCtxProvider } from '../context/TypingContext/provider'
import { useAttemptsHistory } from '../hooks/useAttemptsHistory'
import '../styles/globals.css'
import { getRandomText } from '../utils/getRandomText'

function MyApp({
    Component,
    pageProps,
    router,
    initialText = 'some hi',
}: AppProps & { initialText: string }) {
    const { addAttempt } = useAttemptsHistory()

    return (
        <TypingCtxProvider
            initialText={'hello my name is some'}
            attemptDuration={30}
            fetchText={getRandomText}
            onComplete={(payload) => {
                addAttempt(payload)
                router.push('/analytics')
            }}
        >
            <Component {...pageProps} />
        </TypingCtxProvider>
    )
}

export default MyApp
