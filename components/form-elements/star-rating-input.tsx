import { useState, useEffect } from 'react';
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@styles/components/form-elements/star-rating-input.module.scss";

type Props = {
    onChange: (value: number) => void;
    value: number
}

const StarRatingInput = ({onChange, value}: Props) => {

    return (
        <form className={styles.rating}>
            {Array.from({ length: 5 }, (_, index) => (
                <label key={index}>
                    <input 
                        type="radio" 
                        name="stars" 
                        value={index + 1} 
                        checked={value === index + 1} 
                        onChange={(e) => onChange(parseInt(e.target.value))} 
                    />
                    {Array.from({ length: index + 1 }, (_, subIndex) => (
                        <span className={styles.icon} key={subIndex}>
                            <FontAwesomeIcon icon={subIndex < value ? faStar : emptyStar}/>
                        </span>
                    ))}
                </label>
            ))}
        </form>
    );
}

export default StarRatingInput;
