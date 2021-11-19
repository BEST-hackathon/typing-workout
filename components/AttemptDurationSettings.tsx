import cs from 'classnames'
import { useTypingCtx } from '../context/TypingContext/provider'
import styles from '../styles/Typing.module.css'

const availableTimes = [15, 30, 45]

export const AttemptDurationSettings = () => {
    const { attemptDuration, setAttemptDuration } = useTypingCtx()

    return (
        <div className={styles.timePickBox}>
            {availableTimes.map((time, idx) => (
                <div
                    key={idx}
                    className={cs(styles.timePick, {
                        [styles.active]: time === attemptDuration,
                    })}
                    onClick={() => setAttemptDuration(time)}
                >
                    {time}
                </div>
            ))}
        </div>
    )
}
