import { AnimatePresence } from "framer-motion";
import Modal from "./modal";
import SectionTitle from "@components/section-title";

import styles from "@styles/components/modals/reviews-modal.module.scss";
import { Review, SessionUser } from "@lib/types";
import StarRating from "@components/star-rating";
import Button from "@components/button";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import TextInput from "@components/form-elements/text-input";
import { useEffect, useState } from "react";
import StarRatingInput from "@components/form-elements/star-rating-input";
import Toast from "@components/toast";
import { useSession } from "next-auth/react";

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

	const [review, setReview] = useState("");
	const [rating, setRating] = useState(1);
	const [invalidField, setInvalidField] = useState(false);
	const [displayModerationToast, setDisplayModerationToast] = useState(false);
	const [displayReviewForm, setDisplayReviewForm] = useState(false);
	const currentUser = useSession().data?.user as SessionUser | undefined;

	useEffect(() => {
			// hide form if user has already commented
			setDisplayReviewForm(!reviews.find(r => r.user.id === currentUser?.id));
    }, [reviews]);

    const cards = [];
    for (const review of reviews) {
        const user = review.user;
        const date = new Date(review.createdAt);
        cards.push(
            <div className={styles.card}>
                <img src={user.image ?? ""} alt="user picture" />
                <div className={styles.cardContent}>
                    <h3>{user.name}</h3>
                    <p className={styles.date}>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</p>
                    <StarRating average={review.rating}/>
                    <p>{review.comment}</p>
                </div>
            </div>
        );
    }

	const moderateComment = async (text: string) : Promise<boolean> => {
        try {
			const response = await fetch('/api/wording/validate', {
				method: 'POST',
				body: JSON.stringify({
					text
				})
			}).then(res => res.json());
	
			return response.result;

		} catch (error) {
			console.error("An error happened during text moderation attempt", error);
			return false;
		}
    };

	const validateForm = async () => { 
		setInvalidField(false);

		// comment moderation
		if(review) {
			let commentIsValid = await moderateComment(review);
			setDisplayModerationToast(!commentIsValid);
			setInvalidField(!commentIsValid);
			if(!commentIsValid) return;
		}

		// add review
		try {
			const response = await fetch('/api/reviews/create', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					rating,
					comment: review,
					spotId
				})
			}).then(res => res.json());
			// trigger spot reload
			onReload();
			console.log(response)

		} catch (error) {
			console.error(error);
		}
	}

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
					<section className={styles.section}>
						{cards.length > 0 
							?
								<div className={styles.reviewsContainer}>
									{cards}
								</div>
							:
							<p className={styles.empty}>Aucun avis pour l'instant.</p>
						}
					</section>
					{ displayReviewForm && <form className={styles.form}>
						<StarRatingInput onChange={(value) => setRating(value)} ></StarRatingInput>
						<TextInput isTextArea className={styles.textInput} maxLength={240} isInvalid={invalidField} placeholder="Votre avis..." value={review} onChange={(value) => setReview(value)}></TextInput>
						<Button
							fullWidth
							onClick={() => validateForm()}
							dark
							role="secondary">
							Ajouter
						</Button>
					</form>
					}
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