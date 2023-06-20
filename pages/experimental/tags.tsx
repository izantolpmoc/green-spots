import { useState } from "react";

const Tags = () => {

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
				method: 'PUT',
				body: JSON.stringify({ id: "replaceWithTagId", name: "Station de vélib", description: "Une station de vélib est disponible à proximité."}),
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

		// delete tag test
		const DeleteTag = async () => {
			try {
				const res = await fetch(`/api/tags/delete/replaceWithTagId`, {
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
			<button type="button" onClick={DeleteTag}>Delete a tag from the database</button>
			</div>
        </>
    )

}


export default Tags