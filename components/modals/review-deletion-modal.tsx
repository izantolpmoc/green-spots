import { AnimatePresence } from "framer-motion";
import Modal from "./modal";
import SectionTitle from "@components/section-title";
import Button from "@components/button";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import styles from "@styles/components/modals/review-deletion-modal.module.scss";

interface Props {
	showModal: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

const ReviewDeletionModal = (
	{
		showModal,
		onClose,
		onConfirm
	}: Props
) => {


	// render

	return (
		<AnimatePresence
			initial={false}
			mode='wait'
			onExitComplete={() => null}>
			{
				showModal ?
				<Modal onClose={onClose} dark>
					<section className={styles.section}>
						<SectionTitle dark>Confirmation</SectionTitle>
						<span className={styles.caption}>
							Do you want to delete this review?
						</span>
						<div className={styles.buttonsContainer}>
							<Button 
								role="secondary"
								fullWidth
                                dark
								onClick={onClose}>
								Cancel
							</Button>
							<Button 
								error
								fullWidth
								icon={faTrash}
								onClick={onConfirm}>
								Delete
							</Button>
						</div>
					</section>
				</Modal>
				:
				<></>
			}
		</AnimatePresence>
	)
}

export default ReviewDeletionModal