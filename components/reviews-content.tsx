import StarRating from "@components/star-rating";
import { Review, SessionUser } from "@lib/types";
import styles from "@styles/components/modals/reviews-modal.module.scss";
import { useState, useEffect } from "react";
import StarRatingInput from "@components/form-elements/star-rating-input";
import TextInput from "@components/form-elements/text-input";
import Button from "@components/button";
import { useSession } from "next-auth/react";

interface ReviewsContentProps {
    reviews: Review[];
    spotId: string;
    onReload: () => void;
    onDisplayModerationToast: (value: boolean) => void;
}

const ReviewsContent = ({
    reviews,
    spotId,
    onReload,
    onDisplayModerationToast
}: ReviewsContentProps) => {

const [review, setReview] = useState("");
const [rating, setRating] = useState(1);
const [invalidField, setInvalidField] = useState(false);
const [displayReviewForm, setDisplayReviewForm] = useState(false);
const currentUser = useSession().data?.user as SessionUser | undefined;

useEffect(() => {
    // hide form if user has already commented
    setDisplayReviewForm(!reviews.find(r => r.user.id === currentUser?.id));
}, [reviews]);

const cards = reviews.map(review => {
    const user = review.user;
    const date = new Date(review.createdAt);

    return (
    <div className={styles.card} key={review.id}>
        <img src={user.image ?? ""} alt="user picture" />
        <div className={styles.cardContent}>
        <h3>{user.name}</h3>
        <p className={styles.date}>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</p>
        <StarRating average={review.rating}/>
        <p>{review.comment}</p>
        </div>
    </div>
    );
});

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
    let commentIsValid = await moderateComment(review.toLowerCase());
    setInvalidField(!commentIsValid);
    onDisplayModerationToast(!commentIsValid);
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

return (
    <div>
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
        {displayReviewForm &&
            <form className={styles.form}>
            <StarRatingInput onChange={setRating}></StarRatingInput>
            <TextInput 
                isTextArea 
                className={styles.textInput} 
                maxLength={240} 
                isInvalid={invalidField} 
                placeholder="Votre avis..." 
                value={review} 
                onChange={setReview}/>
            <Button
                fullWidth
                onClick={validateForm}
                dark
                role="secondary">
                Ajouter
            </Button>
            </form>
        }
    </div>
);
}

export default ReviewsContent;
