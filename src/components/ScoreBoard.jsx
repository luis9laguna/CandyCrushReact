import styles from './ScoreBoard.module.css'

const ScoreBoard = ({score}) => {
    return (
        <div className={styles.container}>
            <div className={styles.title}>SCORE</div>
            <div className={styles.score}>{score}</div>
        </div>
    )
}

export default ScoreBoard
