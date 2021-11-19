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

export const UserProgressChart = () => {
    const { history } = useAttemptsHistory()

    const chartsData = history.map((h) => ({ wpm: h.record.wpm }))

    return (
        <>
            <h1 className={styles.title}>
                Your <span>WPM</span> improvements
            </h1>

            <ResponsiveContainer height={300} width="100%">
                <LineChart data={chartsData}>
                    <CartesianGrid />
                    <XAxis />
                    <YAxis yAxisId="left" />
                    <YAxis orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="wpm"
                        stroke="#8884d8"
                    />
                </LineChart>
            </ResponsiveContainer>
        </>
    )
}
