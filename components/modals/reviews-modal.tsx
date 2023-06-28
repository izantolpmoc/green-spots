import { AnimatePresence } from "framer-motion";
import Modal from "./modal";
import SectionTitle from "@components/section-title";

import styles from "@styles/components/modals/reviews-modal.module.scss";
import { Review } from "@lib/types";
import Button from "@components/button";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Toast from "@components/toast";
import ReviewsContent from "@components/reviews-content";

interface Props {
	showModal: boolean;
	onClose: () => void;
	onReload: () => void;
    reviews: Review[];
	spotId: string;
}

const ReviewsModal = (
	{
		showModal,
		onClose,
		onReload,
        reviews,
		spotId
	}: Props
) => {

	const [displayModerationToast, setDisplayModerationToast] = useState(false);


	// render

	return (
		<AnimatePresence
			initial={false}
			mode='wait'
			onExitComplete={() => null}>
			{
				showModal &&
				<Modal onClose={onClose} className={styles.modal} dark customHeader={
					<div className={styles.header}>
						<div className={styles.buttonContainer}>
							<Button 
								onClick={() => onClose()}
								icon={faXmark}
								dark
								role="secondary"
								className={styles.closeBtn}
							/>
						</div>
						<SectionTitle dark>Avis</SectionTitle>
					</div>
				}>
					<ReviewsContent 
						reviews={reviews}
						spotId={spotId}
						onReload={onReload}
						onDisplayModerationToast={setDisplayModerationToast}
					/>
				</Modal>
			}
			<Toast 
				status='error'
				showToast={displayModerationToast}
				onHide={() => setDisplayModerationToast(false)}>
				Certains termes utilisés ne peuvent être acceptés.
			</Toast>
		</AnimatePresence>
	)
}

export default ReviewsModal