import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import { AnalyticsChart } from '../components/AnalyticsChart'
import { Footer } from '../components/Footer'
import { UserProgressChart } from '../components/UserProgressChart'
import { useTypingCtx } from '../context/TypingContext'
import styles from '../styles/Analytics.module.css'

const Analytics: NextPage = () => {
    const { attemptDuration } = useTypingCtx()

    return (
        <div className={styles.container}>
            <Head>
                <title>Typing Report</title>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    <span>{attemptDuration}</span> sec typing completed!
                </h1>

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
