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

MyApp.getInitialProps = async (app: AppContext) => {
    const payload = await App.getInitialProps(app)
    const initialText = await getRandomText(
        absoluteUrl(app.ctx.req, app.ctx.req?.headers.host).origin
    )
    return {
        ...payload,
        initialText: initialText,
    }
}

export default MyApp
