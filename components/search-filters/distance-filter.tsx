import RangeInput from "@components/form-elements/range-input";

import styles from "@styles/components/search-filters/distance-filter.module.scss"


interface Props {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max: number;
    name?: string;
}

const DistanceFilter = (
    {
        value,
        onChange,
        min = 0,
        max,
        name
    }: Props
) => {


    // render 

    return (
        <div className={styles.filter}>
            <RangeInput
                name={name}
                value={value}
                onChange={onChange}
                min={min}
                max={max}
            />   
            <div className={styles.values}>
                <span>{min} km</span>
                <span>{value} km</span>
                <span>{max} km</span>
            </div>     
        </div>
    )

}

export default DistanceFilter