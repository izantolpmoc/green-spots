
import styles from "@styles/components/form-elements/input-image.module.scss"

interface Props {
  onChange: (event: any) => void;
  name?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  isInvalid?: boolean;
}

const InputImage = (
  {
      onChange,
      name,
      placeholder,
      className,
      required,
      isInvalid
  }: Props
) => {


   // utils

  const getClassNames = () => {
    let classNames = styles.imageInput
    classNames += ' ' + (isInvalid ? styles['invalid'] : '')
    classNames += ' ' + (className ? className : '')
    return classNames
  }


  return (
    <input 
      name={name}
      type="file"
      accept="image/*" 
      className={getClassNames()}
      placeholder={placeholder}
      required={required}
      onChange={onChange}
    />
  );
}

export default InputImage;