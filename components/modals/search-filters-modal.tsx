import { AnimatePresence } from "framer-motion";
import Modal from "./modal";
import SectionTitle from "@components/section-title";
import { useContext } from "react";
import { Context } from "@lib/context";
import SearchBar from "@components/form-elements/search-bar";

import styles from "@styles/components/modals/search-filters-modal.module.scss"
import Button from "@components/button";
import useDeviceType from "../../hooks/use-device-type";
import FilterLabel from "@components/form-elements/filter-label";
import DistanceFaderInput from "@components/form-elements/distance-fader-input";

interface Props {
    showModal: boolean;
    onClose: () => void;
    onSubmit: () => void;
}


const SearchFiltersModal = (
    {
        showModal,
        onClose,
        onSubmit
    }: Props
) => {

    const deviceType = useDeviceType()

    // get filters' state from context

    const {
        searchQuery,
        setSearchQuery,
        maxDistance,
        setMaxDistance,
        tags,
        setTags,
    } = useContext(Context)

    // render

    return (
        <AnimatePresence
            // Disable any initial animations on children that
            // are present when the component is first rendered
            initial={false}
            // Only render one component at a time.
            // The exiting component will finish its exit
            // animation before entering component is rendered
            mode='wait'
            // Fires when all exiting nodes have completed animating out
            onExitComplete={() => null}
        >
            {showModal && 
                <Modal 
                    isForm
                    btnRight 
                    onClose={onClose} 
                    className={styles.modal}
                    customHeader={
                        deviceType !== "mobile" ?
                        <SearchBar 
                            className={styles.searchBar}
                            value={searchQuery}
                            onChange={setSearchQuery}
                            onSubmit={onSubmit}
                        />
                        : undefined
                    }>
                    <SectionTitle small>Filtres de recherche</SectionTitle>
                    {
                        deviceType == "mobile" ?
                        <SearchBar 
                            value={searchQuery}
                            onChange={setSearchQuery}
                            onSubmit={onSubmit}
                        /> : <></>
                    }
                    <FilterLabel>Distance max</FilterLabel>
                    <DistanceFaderInput
                        value={maxDistance}
                        onChange={setMaxDistance}
                        max={20}
                    />

                    <p>{maxDistance}</p>
                    <div className={styles.buttonsContainer}>
                        <Button
                            role="tertiary"
                            fullWidth
                            onClick={() => {
                                setMaxDistance(10)
                                setTags([])
                            }}>
                            Tout Effacer
                        </Button>
                        <Button 
                            fullWidth
                            type="submit"
                            onClick={e => {
                                e.preventDefault()
                                onSubmit()
                            }}>
                            Appliquer
                        </Button>
                    </div>
                </Modal>
            }
        </AnimatePresence>
    )

}

export default SearchFiltersModal