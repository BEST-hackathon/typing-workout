import type { NextPage } from 'next'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import React from 'react'
import { AnalyticsChart } from '../components/AnalyticsChart'
import { Footer } from '../components/Footer'
import { useTypingCtx } from '../context/TypingContext'
import styles from '../styles/Analytics.module.css'

const Analytics: NextPage = () => {
    const router = useRouter()
    const { restart, words, attemptDuration, activeWordIdx } = useTypingCtx()

    const wpm =
        words.filter((w) => !w.wronglyTyped && w.typeHistory.length).length *
        (60 / attemptDuration)

    const raw =
        words.filter((w) => w.typeHistory.length).length *
        (60 / attemptDuration)

    return (
        <div className={styles.container}>
            <Head>
                <title>Typing Trainer Report</title>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Attempt <span>Analytics</span>
                </h1>

                <div className={styles.statsBox}>
                    {Boolean(activeWordIdx) && (
                        <div className={styles.numbersBox}>
                            <div>
                                <h1>{wpm}</h1>
                                <span>wpm</span>
                            </div>

                            <div>
                                <h1>{raw}</h1>
                                <span>raw</span>
                            </div>
                        </div>
                    )}

                    <AnalyticsChart />
                </div>

                <div
                    className={styles.restart}
                    onClick={() => {
                        restart()
                        router.push('/')
                    }}
                >
                    Try again
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default Analytics
