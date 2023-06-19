import { useState } from "react";

const Experimental = () => {

	const [tagName, setTagName] = useState('');
	const [tagDescription, setTagDescription] = useState('');

    // create tag
	const CreateTag = async () => {
		try {
			const res = await fetch(`/api/tags/create`, {
				method: 'POST',
				body: JSON.stringify({ name: tagName, description: tagDescription}),
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

	// update tag test
	const UpdateTag = async () => {
		try {
			const res = await fetch(`/api/tags/update`, {
				method: 'POST',
				body: JSON.stringify({ id: "clj2pszg10008vubswsi1afki", name: "Station de vélib", description: "Une station de vélib est disponible à proximité."}),
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

			<button type="button" onClick={UpdateTag}>Update tag with a set of values.</button>
			</div>
        </>
    )

}


export default Experimental