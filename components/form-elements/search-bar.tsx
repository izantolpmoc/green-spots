
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@styles/components/form-elements/search-bar.module.scss"

interface Props {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    className?: string;
}

const SearchBar = (
    {
        value,
        onChange,
        onSubmit,
        className
    }: Props
) => {

    const getClassNames = () => {
        let classNames = styles.searchBarContainer
        classNames += ' ' + (className ? className : '')
        return classNames
    }

    // render

    return (
        <div className={getClassNames()}>
            <FontAwesomeIcon icon={faSearch} />
            <input 
                className={styles.searchBar}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' ? onSubmit() : null}
                placeholder="Rechercher un spot"
            />
        </div>
    )

}

export default SearchBar