
import styles from "@styles/components/form-elements/range-input.module.scss"
import { useEffect, useRef } from "react";

interface Props {
    value: number;
    onChange: (value: number) => void;
    name?: string;
    min?: number;
    max: number;
}

const RangeInput = (
    {
        value,
        onChange,
        name,
        min = 0,
        max
    }: Props
) => {

    const inputRef = useRef<HTMLInputElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!inputRef.current) return
        const numberValue = parseInt(e.target.value)
        inputRef.current.style.backgroundSize = `${(numberValue - min) * 100 / (max - min)}% 100%`
        onChange(numberValue)
    }

    useEffect(() => {
        if(!inputRef.current) return
        inputRef.current.style.backgroundSize = `${(value - min) * 100 / (max - min)}% 100%`
    }, [value])

    // render

    return (
        <input
            ref={inputRef}
            className={styles.input} 
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={handleChange}
            name={name}
        />

    )
}

export default RangeInput