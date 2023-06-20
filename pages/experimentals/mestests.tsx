import '@fortawesome/fontawesome-svg-core/styles.css'
import { useEffect } from 'react';

const Mestests = () => {
    const handleEvent = async () => {
        const response = await fetch('/api/wording/validate', {
            method: 'POST',
            body: JSON.stringify({
                text: "Nique ta mère la salope"
            })
        }).then(res => res.json());

        console.log(response);
    };

    useEffect(() => {
        handleEvent();
    }, []);

    return (
        <>
            <h1>Imagga</h1>
        </>
    )
}

export default Mestests;