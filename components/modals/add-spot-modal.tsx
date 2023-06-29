import { AnimatePresence } from "framer-motion"
import Modal from "./modal"
import { useContext, useState } from "react"
import styles from "@styles/components/modals/add-spot-modal.module.scss"
import SectionTitle from "@components/section-title"
import TextInput from "@components/form-elements/text-input"
import FilterLabel from "@components/form-elements/filter-label"
import SectionHeader from "@components/layout/section-header"
import Button from "@components/button"
import MultiSelect from "@components/form-elements/multi-select"
import { GetServerSideProps } from "next"
import prisma from "@lib/prisma"
import { Context } from "@lib/context"

type Props = {
    showModal: boolean;
    onClose: () => void;
}

const AddSpotModal = ({ showModal, onClose }: Props) => {

    // state

    const [spotName, setSpotName] = useState("");
    const [description, setDescription] = useState("")
    const [spotSite, setSpotSite] = useState("");
    const [spotStreet, setSpotStreet] = useState("");
    const [spotCity, setSpotCity] = useState("");
    const [spotZipCode, setSpotZipCode] = useState("");

    const onSubmit = () => {
        console.log("SUBMIT")
        // BLABLA
    }

    const {
        tags,
        selectedTags,
        setSelectedTags
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
                 <Modal onClose={onClose} className={styles.modal} large>

                    <SectionTitle>Ajouter un spot</SectionTitle>

                    <section className={styles.main}>

                        <div className={styles.container}>
                            <FilterLabel>Nom du spot</FilterLabel>
                            <TextInput
                                className={styles.textInput}
                                placeholder="Jardin des Tuileries"
                                value={spotName}
                                onChange={setSpotName}
                            />
                            <FilterLabel>Description</FilterLabel>
                            <p>Description courte (max 140 caractères).</p>
                            <TextInput 
                                className={styles.textInput}
                                placeholder="Lorem ipsum..."
                                isTextArea
                                value={description}
                                onChange={setDescription}
                            />
                            <FilterLabel>Spécificités</FilterLabel>
                            <MultiSelect
                                name="tags"
                                value={selectedTags}
                                onChange={setSelectedTags}
                                options={tags}
                                placeholder="Rechercher une spécificité..."
                                noOptionsMessage="Aucune spécificité trouvée"
                            />
                        </div>

                        <div className={styles.container}>
                        <FilterLabel>Nom du spot</FilterLabel>
                            <TextInput
                                className={styles.textInput}
                                placeholder="https://super..site.fr"
                                value={spotSite}
                                onChange={setSpotSite}
                            />
                            <FilterLabel>Adresse</FilterLabel>
                            <p>Rue et numéro</p>
                            <TextInput
                                className={styles.textInput}
                                placeholder="Pl. de la Concorde"
                                value={spotStreet}
                                onChange={setSpotStreet}
                            />
                            <p>Ville et code postal</p>
                            <div className={styles.group}>
                                <TextInput
                                    className={styles.textInput}
                                    placeholder="Paris"
                                    value={spotCity}
                                    onChange={setSpotCity}
                                />
                                <TextInput
                                    className={styles.textInput}
                                    placeholder="75001"
                                    value={spotZipCode}
                                    onChange={setSpotZipCode}
                                />
                            </div>
                        </div>
                    </section>

                    <div className={styles.buttonsContainer}>
                            <Button
                                role="tertiary"
                                fullWidth
                                onClick={() => {
                                    // onSubmit()
                                    onClose()
                                }}>
                                Abandonner
                            </Button>
                            <Button 
                                fullWidth
                                type="submit"
                                onClick={e => {
                                    e.preventDefault()
                                    onSubmit()
                                    onClose()
                                }}>
                                Créer
                            </Button>
                        </div>
                 </Modal>
            }
        </AnimatePresence>
    )
}

export default AddSpotModal;