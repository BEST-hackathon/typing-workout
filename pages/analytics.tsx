import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import { AnalyticsChart } from '../components/AnalyticsChart'
import { Footer } from '../components/Footer'
import styles from '../styles/Analytics.module.css'

const Analytics: NextPage = () => {
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
                    <AnalyticsChart />
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default Analytics
