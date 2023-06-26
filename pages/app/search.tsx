import Button from "@components/button"
import SearchBar from "@components/form-elements/search-bar"
import SectionHeader from "@components/layout/section-header"
import SearchFiltersModal from "@components/modals/search-filters-modal"
import SectionTitle from "@components/section-title"
import { faSliders } from "@fortawesome/free-solid-svg-icons"
import { Context } from "@lib/context"

import styles from "@styles/pages/search.module.scss"
import { useContext, useState } from "react"


const Search = () => {

    const { searchQuery, setSearchQuery } = useContext(Context)

    // manage search filters modal

    const [showSearchFiltersModal, setShowSearchFiltersModal] = useState(false)

    return (
        <>
            <main id={styles.main}>
                <SectionHeader>
                    <SectionTitle>Recherche</SectionTitle>
                    <p>Trouver le spot qui vous convient !</p>
                </SectionHeader>
                <div className={styles.horizontalContainer}>
                    <SearchBar 
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSubmit={() => console.log(searchQuery)}
                    />
                    <Button
                        icon={faSliders}
                        onClick={() => setShowSearchFiltersModal(true)}
                    />
                </div>
            </main>
            <SearchFiltersModal
                showModal={showSearchFiltersModal}
                onClose={() => setShowSearchFiltersModal(false)}
                onSubmit={() => console.log("submit")}
            />
        </>
    )
}

export default Search