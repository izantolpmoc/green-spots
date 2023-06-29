import { AnimatePresence } from "framer-motion"
import Modal from "./modal"
import { useContext, useState } from "react"
import styles from "@styles/components/modals/add-spot-modal.module.scss"
import SectionTitle from "@components/section-title"
import TextInput from "@components/form-elements/text-input"
import FilterLabel from "@components/form-elements/filter-label"
import Button from "@components/button"
import MultiSelect from "@components/form-elements/multi-select"

import { Context } from "@lib/context"

type Props = {
    showModal: boolean;
    onClose: () => void;
}

const AddSpotModal = ({ showModal, onClose}: Props) => {

    // state

    const [spotName, setSpotName] = useState("");
    const [description, setDescription] = useState("")
    const [spotStreet, setSpotStreet] = useState("");
    const [spotCity, setSpotCity] = useState("");
    const [spotZipCode, setSpotZipCode] = useState("");
    const [image, setImage] = useState("")
    const [imageMessage, setImageMessage] = useState("");

    // get filters' state from context

    const {
        tags,
        selectedTags,
        setSelectedTags
    } = useContext(Context)

    // handle Image

    function handleImage(event: any) {
        
        setImageMessage("");

        const file = event.target.files[0];
        const reader = new FileReader();
      
        reader.onload = async function(e: any) {
            const base64Image = e.target.result;

            const response = await fetch('/api/image/service', {
                method: 'POST',
                body: JSON.stringify({
                    base64: base64Image
                })
            })

            const data = await response.json();

            if (data.result == false) return setImageMessage("The image doesn't seem to be conforme or isn't in the right format. Please try again!");
            else {
                setImage(data.result);
                return setImageMessage("The image seem to be conforme !")
            }
        };
      
        reader.readAsDataURL(file);
    }

    const onSubmit = () => {
        console.log("SUBMIT")

        console.log(spotName, description, spotStreet, spotCity, spotZipCode, image)
    }

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
                                required
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
                            <FilterLabel>Image</FilterLabel>
                            <input type="file" id="image" accept="image/*" onChange={(e) => handleImage(e)}></input>
                            {imageMessage !== "" && <p> { imageMessage } </p>}
                        </div>

                        <div className={styles.container}>
                            <FilterLabel>Spécificités</FilterLabel>
                            <MultiSelect
                                name="tags"
                                value={selectedTags}
                                onChange={setSelectedTags}
                                options={tags}
                                placeholder="Rechercher une spécificité..."
                                noOptionsMessage="Aucune spécificité trouvée"
                            />
                            <FilterLabel>Adresse</FilterLabel>
                            <p>Rue et numéro</p>
                            <TextInput
                                required
                                className={styles.textInput}
                                placeholder="Pl. de la Concorde"
                                value={spotStreet}
                                onChange={setSpotStreet}
                            />
                            <p>Ville et code postal</p>
                            <div className={styles.group}>
                                <TextInput
                                    required
                                    className={styles.textInput}
                                    placeholder="Paris"
                                    value={spotCity}
                                    onChange={setSpotCity}
                                />
                                <TextInput
                                    required
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