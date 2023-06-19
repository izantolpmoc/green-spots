import { useState } from "react";

const Experimental = () => {

	const [tagName, setTagName] = useState('');
	const [tagDescription, setTagDescription] = useState('');

    // create tag
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

	// find tags by name (returns a list of tags that contains the selected string)
	const FindTag = async () => {
		try {
			const res = await fetch(`/api/tags/${tagName}`, {
				method: 'GET'
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

			<div>
				<h1>Find tags by Name</h1>
				<input type="text" name="tagName" onChange={(e) => setTagName(e.target.value)} />
				<button type="button" onClick={FindTag}>Chercher</button>
			</div>
			</div>
        </>
    )

}


export default Experimental