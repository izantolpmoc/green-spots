import { AnimatePresence } from "framer-motion"
import Modal from "./modal"
import { useContext, useEffect, useState } from "react"
import styles from "@styles/components/modals/add-spot-modal.module.scss"
import SectionTitle from "@components/section-title"
import TextInput from "@components/form-elements/text-input"
import FilterLabel from "@components/form-elements/filter-label"
import Button from "@components/button"
import MultiSelect from "@components/form-elements/multi-select"
import InputImage from "@components/form-elements/input-image"
import { getCoordinatesByAddress } from '@lib/open-street-map'
import { Context } from "@lib/context"

type Props = {
    showModal: boolean;
    onClose: () => void;
}

const AddSpotModal = ({ showModal, onClose}: Props) => {

    // state

    const [spotName, setSpotName] = useState("");
    const [spotDescription, setSpotDescription] = useState("")
    const [spotStreet, setSpotStreet] = useState("");
    const [spotCity, setSpotCity] = useState("");
    const [spotPostalCode, setSpotPostalCode] = useState("");
    const [image, setImage] = useState("")
    const [imageMessage, setImageMessage] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([])

    // get filters' state from context

    const { tags } = useContext(Context)

    // handle Image

    function handleImage(event: any) {
        
        setImageMessage("");
        setImage("");

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

            if (data.result == false) return setImageMessage("L'image semble ne pas être au bon format ou être inappropriée. Réessayez avec une autre !");
            else {
                setImage(data.result);
                return setImageMessage("Image validée !")
            }
        };
      
        reader.readAsDataURL(file);
    }

    const getInvalidFields = () => {
        let fields: string[] = []

        if(!spotName) fields.push("name")
        if(!spotStreet) fields.push("address")
        if(!image) fields.push("image")
        if(!spotCity) fields.push("city")
        if(!spotPostalCode) fields.push("postalCode")

        return fields
    }

    const handleSubmit = async () => {

        let localisation = await getCoordinatesByAddress(spotStreet)

        if(!localisation) return;

        const currentInvalidFields = getInvalidFields()
        setInvalidFields(currentInvalidFields)

        if(currentInvalidFields.length > 0) return

        let body = {
            name: spotName,
            description: spotDescription,
            latitude: parseFloat(localisation.latitude),
            longitude: parseFloat(localisation.longitude),
            address: spotStreet,
            city: spotCity,
            postalCode: spotPostalCode,
            tags: selectedTags,
            image: image,
        }

        fetch("/api/spots/create", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(body)
        }).then(res => res.json()).then(res => {
            if(res) {
                onClose();
            }
        })
    }

    // manage fields validation

    const [invalidFields, setInvalidFields] = useState<string[]>([])

    useEffect(() => {}, [image])
    
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
                                name="name"
                                isInvalid={invalidFields.includes("name")}
                                className={styles.textInput}
                                placeholder="Jardin des Tuileries"
                                value={spotName}
                                onChange={setSpotName}
                            />
                            <FilterLabel>Description</FilterLabel>
                            <p>Description courte (max 140 caractères).</p>
                            <TextInput 
                                name="description"
                                className={styles.textInput}
                                placeholder="Lorem ipsum..."
                                isTextArea
                                value={spotDescription}
                                onChange={setSpotDescription}
                            />
                            <FilterLabel>Image</FilterLabel>
                            <InputImage
                                required
                                name="image"
                                isInvalid={invalidFields.includes("image")}
                                onChange={handleImage}
                            />
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
                                name="address"
                                isInvalid={invalidFields.includes("address")}
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
                                    isInvalid={invalidFields.includes("city")}
                                    placeholder="Paris"
                                    value={spotCity}
                                    onChange={setSpotCity}
                                />
                                <TextInput
                                    required
                                    className={styles.textInput}
                                    isInvalid={invalidFields.includes("postalCode")}
                                    placeholder="75001"
                                    value={spotPostalCode}
                                    onChange={setSpotPostalCode}
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
                                onClick={handleSubmit}>
                                Créer
                            </Button> 
                        </div>
                 </Modal>
            }
        </AnimatePresence>
    )
}

export default AddSpotModal;