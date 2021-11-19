import type { NextPage } from 'next'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import React from 'react'
import { AnalyticsChart } from '../components/AnalyticsChart'
import { AnalyticsStats } from '../components/AnalyticsStats'
import { Footer } from '../components/Footer'
import { UserProgressChart } from '../components/UserProgressChart'
import { useTypingCtx } from '../context/TypingContext'
import { useAttemptsHistory } from '../hooks/useAttemptsHistory'
import styles from '../styles/Analytics.module.css'

const Analytics: NextPage = () => {
    const router = useRouter()
    const { restart } = useTypingCtx()
    const { latestAttempt } = useAttemptsHistory()

    if (!latestAttempt) {
        return <div>Complete the typing test first!</div>
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Typing Report</title>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    <span>{latestAttempt.record.attemptDuration}</span> sec
                    typing completed!
                </h1>

                <AnalyticsStats
                    wpm={latestAttempt.record.wpm}
                    raw={latestAttempt.record.raw}
                />

                <div
                    className={styles.restart}
                    onClick={() => {
                        restart()
                        router.push('/')
                    }}
                >
                    Try again
                </div>

                <div className={styles.statsBox}>
                    <AnalyticsChart />
                </div>

                <div className={styles.statsBox}>
                    <UserProgressChart />
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default Analytics
