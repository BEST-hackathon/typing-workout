import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { useAttemptsHistory } from '../hooks/useAttemptsHistory'
import styles from '../styles/Analytics.module.css'

export const AnalyticsChart = () => {
    const { latestAttempt } = useAttemptsHistory()

    if (!latestAttempt) {
        return null
    }

    return (
        <>
            <h1 className={styles.title}>
                <span>RAW</span> and <span>WPM</span> stats
            </h1>

            <ResponsiveContainer height={300} width="100%">
                <LineChart data={latestAttempt.record.chartsData}>
                    <CartesianGrid />
                    <XAxis />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="wpm"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                    />
                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="raw"
                        stroke="#82ca9d"
                    />
                </LineChart>
            </ResponsiveContainer>
        </>
    )
}
