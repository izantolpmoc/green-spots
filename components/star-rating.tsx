import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@styles/components/star-rating.module.scss"

type Props = {
    // rating / 5
    average: number,
}

const StarRating = ({average} : Props) => {
    const stars = [];
    // set the width of each star individually based on average
    for (let i = 0; i < 5; i++) {
        const width = (average > i) 
            ? (average - i >= 1) 
                ? "100%" 
                : `${(average - i) * 100}%`
            : "0%";
        stars.push(
            <div key={i} className={styles.starContainer}>
                <span className={styles.starActive} style={{width}}>
                    <FontAwesomeIcon icon={faStar} />
                </span>
                <span className={styles.starInactive}>
                    <FontAwesomeIcon icon={emptyStar} />
                </span>
            </div>
        );
    }

    return (
        <span className={styles.score}>
            <div className={styles.scoreWrap}>
                {stars}
            </div>
        </span>
    );
}

export default StarRating;
