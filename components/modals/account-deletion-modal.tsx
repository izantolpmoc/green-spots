import { AnimatePresence } from "framer-motion";
import Modal from "./modal";
import SectionTitle from "@components/section-title";
import Button from "@components/button";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import styles from "@styles/components/modals/account-deletion-modal.module.scss";

interface Props {
	showModal: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

const AccountDeletionModal = (
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
				<Modal onClose={onClose}>
					<section className={styles.section}>
						<SectionTitle>Confirmation</SectionTitle>
						<span className={styles.caption}>
							Are you certain you wish to delete your account?
						</span>
						<div className={styles.buttonsContainer}>
							<Button 
								role="secondary"
								fullWidth
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

export default AccountDeletionModal