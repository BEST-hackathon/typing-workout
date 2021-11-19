import absoluteUrl from 'next-absolute-url'
import type { AppContext, AppProps } from 'next/app'
import App from 'next/app'
import React from 'react'
import { TypingCtxProvider } from '../context/TypingContext/provider'
import { useAttemptsHistory } from '../hooks/useAttemptsHistory'
import '../styles/globals.css'
import { getRandomText } from '../utils/getRandomText'

function MyApp({
    Component,
    pageProps,
    router,
    initialText,
}: AppProps & { initialText: string }) {
    const { addAttempt } = useAttemptsHistory()

    return (
        <TypingCtxProvider
            initialText={initialText}
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

MyApp.getInitialProps = async (ctx: AppContext) => {
    const payload = await App.getInitialProps(ctx)
    const initialText = await getRandomText(absoluteUrl(ctx.ctx.req).origin)
    return {
        ...payload,
        initialText,
    }
}

export default MyApp
