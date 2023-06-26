

import styles from "@styles/components/form-elements/text-input.module.scss"

interface Props {
    value: string;
    onChange: (value: string) => void;
    name?: string;
    placeholder?: string;
    isTextArea?: boolean;
    type?: string;
    className?: string;
    fullWidth?: boolean;
    required?: boolean;
    isInvalid?: boolean;
}


const TextInput = (
    {
        value,
        onChange,
        name,
        placeholder,
        isTextArea,
        type,
        className,
        fullWidth,
        required,
        isInvalid
    }: Props
) => {

    // utils

    const getClassNames = () => {
        let classNames = styles.textInput
        classNames += ' ' + (isTextArea ? styles['textArea'] : '')
        classNames += ' ' + (fullWidth ? styles['fullWidth'] : '')
        classNames += ' ' + (isInvalid ? styles['invalid'] : '')
        classNames += ' ' + (className ? className : '')
        return classNames
    }


    // render

    return isTextArea ? (
        <textarea 
            name={name}
            className={getClassNames()}
            value={value}
            placeholder={placeholder}
            required={required}
            onChange={(e) => onChange(e.target.value)}
        />
    )
    :
    (
        <input 
            name={name}
            className={getClassNames()}
            type={type ? type : "text"}
            value={value}
            placeholder={placeholder}
            required={required}
            onChange={(e) => onChange(e.target.value)}
        />
    )

}

export default TextInput