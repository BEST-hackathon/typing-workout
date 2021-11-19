import styles from '../styles/Analytics.module.css'

export const AnalyticsStats = ({ wpm, raw }: { wpm: number; raw: number }) => {
    return (
        <div className={styles.typingStats}>
            <div>
                <h1>{wpm}</h1>
                <span>wpm</span>
            </div>

            <div>
                <h1>{raw}</h1>
                <span>raw</span>
            </div>
        </div>
    )
}
