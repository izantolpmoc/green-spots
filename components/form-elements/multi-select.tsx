import Select, { ClassNamesConfig } from "react-select";


import styles from "@styles/components/form-elements/multi-select.module.scss"

interface Props {
    value: string[];
    onChange: (value: string[]) => void;
    options: string[];
    name?: string;
    placeholder?: string;
    noOptionsMessage?: string;
}


// style the select

const customClassNames: ClassNamesConfig = {
    placeholder: () => styles.placeholder,
    container: () => styles.container,
    control: () => styles.control,
    noOptionsMessage: () => styles.noOptionsMessage,
    multiValue: () => styles.multiValue,
    multiValueLabel: () => styles.multiValueLabel,
    option: (state) =>  styles.option + (state.isFocused ? ' ' + styles.optionFocused : '')
}

const MultiSelect = (
    {
        value,
        onChange,
        options,
        name,
        placeholder,
        noOptionsMessage
    }: Props
) => {


    // render

    return (
        <Select
            styles={{
                indicatorSeparator: () => ({ display: "none" })
            }}
            classNames={customClassNames}
            placeholder={placeholder}
            noOptionsMessage={() => noOptionsMessage}
            isMulti
            name={name}
            value={value.map(value => ({ value, label: value }))}
            // @ts-ignore
            onChange={(selected) => onChange(selected.map((option) => option.value))}
            options={options.map((option) => ({ value: option, label: option }))}
        />
    )

}

export default MultiSelect