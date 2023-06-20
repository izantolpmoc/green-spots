import { useState } from "react";

const Reviews = () => {

    const [review, setReview] = useState({
        spotId: "replaceWithSpotId",
        rating: 0,
        comment: ""
    });

    // create review
	const CreateReview = async () => {

        console.log(review)

		try {
			const res = await fetch(`/api/reviews/create`, {
				method: 'POST',
				body: JSON.stringify(review),
				headers: {
					'Content-Type': 'application/json'
				}
		});
			const data = await res.json();
			console.log(data);
		} catch (err) {
			console.log(err);
		}

	}

    // delete review
    const DeleteReview = async () => {
        try {
            const res = await fetch(`/api/reviews/delete/replaceWithReviewId`, {
                method: 'DELETE'
            });
            const data = await res.json();
            console.log(data);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
			<div>
			<h1>Add review form</h1>
			<form method="POST">
				<div>
				<label>Rating</label>
				<input 
					type="number" 
					name="rating" 
					onChange={(e) => setReview({...review, rating: Number(e.target.value)})} 
				/>
				</div>

				<div>
				<label>Comment</label>
				<textarea 
					name="comment" 
					onChange={(e) => setReview({...review, comment: e.target.value})}
				></textarea>
				</div>

				<button type="button" onClick={CreateReview}>Ajouter</button>
			</form>

			<button type="button" onClick={DeleteReview}>Delete a review from the database</button>
			</div>
        </>
    )

}


export default Reviews