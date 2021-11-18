import type { NextPage } from 'next'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import React from 'react'
import { AnalyticsChart } from '../components/AnalyticsChart'
import { AnalyticsStats } from '../components/AnalyticsStats'
import { Footer } from '../components/Footer'
import { UserProgressChart } from '../components/UserProgressChart'
import { useTypingCtx } from '../context/TypingContext'
import styles from '../styles/Analytics.module.css'

const Analytics: NextPage = () => {
    const router = useRouter()
    const { restart, attemptDuration } = useTypingCtx()

    return (
        <div className={styles.container}>
            <Head>
                <title>Typing Report</title>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    <span>{attemptDuration}</span> sec typing completed!
                </h1>

                <AnalyticsStats />

                <div className={styles.statsBox}>
                    <AnalyticsChart />
                </div>

                <div className={styles.statsBox}>
                    <UserProgressChart />
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
