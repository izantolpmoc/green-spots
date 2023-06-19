import { useState } from "react";

const Experimental = () => {
    
    //create tag

	const [tagName, setTagName] = useState('');
	const [tagDescription, setTagDescription] = useState('');

	const CreateTag = async () => {
		console.log(tagName, tagDescription)
		if(!tagName) return;
		try {
			const res = await fetch(`/api/tags/create`, {
				method: 'POST',
				body: JSON.stringify({ name: tagName, description: tagDescription}),
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
			<h1>Add tag form</h1>
			<form method="POST">
				<div>
				<label>Name</label>
				<input 
					type="text" 
					name="name" 
					onChange={(e) => setTagName(e.target.value)} 
					value={tagName}
				/>
				</div>

				<div>
				<label>Description</label>
				<textarea 
					name="message" 
					onChange={(e) => setTagDescription(e.target.value)}
					value={tagDescription}
				></textarea>
				</div>

				<button type="button" onClick={CreateTag}>Ajouter</button>
			</form>
			</div>
        </>
    )

}


export default Experimental