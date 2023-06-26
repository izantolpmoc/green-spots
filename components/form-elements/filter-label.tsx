
import styles from "@styles/components/form-elements/filter-label.module.scss"


interface Props {
    children?: any;
    htmlFor?: string;
}

const FilterLabel = (
    {
        children,
        htmlFor
    }: Props
) => {

    // render

    return (
        <label 
            htmlFor={htmlFor}
            className={styles.filterLabel}>
            {children ? children : "Aucun filtre sélectionné"}
        </label>
    )
}

export default FilterLabel