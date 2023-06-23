import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@styles/components/star-rating.module.scss"

type Props = {
    // rating / 5
    average: number,
}

const StarRating = ({average} : Props) => {

    return(
        <span className={styles.score}>
            <div className={styles.scoreWrap}>
                <span className={styles.starsActive} style={{width: `${average * 100 / 5}%`}}>
                    <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>
                    <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>
                    <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>
                    <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>
                    <FontAwesomeIcon icon={faStar}></FontAwesomeIcon>
                </span>
                <span className={styles.starsInactive}>
                    <FontAwesomeIcon icon={emptyStar}></FontAwesomeIcon>
                    <FontAwesomeIcon icon={emptyStar}></FontAwesomeIcon>
                    <FontAwesomeIcon icon={emptyStar}></FontAwesomeIcon>
                    <FontAwesomeIcon icon={emptyStar}></FontAwesomeIcon>
                    <FontAwesomeIcon icon={emptyStar}></FontAwesomeIcon>
                </span>
            </div>
        </span>
    );
}

export default StarRating