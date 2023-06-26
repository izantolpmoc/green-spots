import { AnimatePresence } from "framer-motion";
import Modal from "./modal";
import SectionTitle from "@components/section-title";

import styles from "@styles/components/modals/reviews-modal.module.scss";
import { Review } from "@lib/types";
import StarRating from "@components/star-rating";

interface Props {
	showModal: boolean;
	onClose: () => void;
    reviews: Review[];
}

const ReviewsModal = (
	{
		showModal,
		onClose,
        reviews
	}: Props
) => {

    const cards = [];
    for (let i = 0; i < reviews.length; i++) {
        const user = reviews[i].user;
        const date = new Date(reviews[i].createdAt);
        cards.push(
            <div className={styles.card}>
                <img src={user.image ?? ""} alt="user picture" />
                <div className={styles.cardContent}>
                    <h3>{user.name}</h3>
                    <p className={styles.date}>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</p>
                    <StarRating average={reviews[i].rating}/>
                    <p>{reviews[i].comment}</p>
                </div>
            </div>
        );
    }

	// render

	return (
		<AnimatePresence
			initial={false}
			mode='wait'
			onExitComplete={() => null}>
			{
				showModal &&
				<Modal onClose={onClose} dark btnRight>
					<section className={styles.section}>
						<SectionTitle dark>Avis</SectionTitle>
						
						<div className={styles.reviewsContainer}>
							{cards}
						</div>
					</section>
				</Modal>
			}
		</AnimatePresence>
	)
}

export default ReviewsModal