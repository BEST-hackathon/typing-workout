import '../styles/globals.css'
import type { AppProps } from 'next/app'
import React from 'react'
import { TypingCtxProvider } from '../context/TypingContext'

function MyApp({ Component, pageProps, router }: AppProps) {
    return (
        <TypingCtxProvider
            secondsCount={30}
            text={`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`}
            onComplete={() => router.push('/analytics')}
        >
            <Component {...pageProps} />
        </TypingCtxProvider>
    )
}

export default MyApp
