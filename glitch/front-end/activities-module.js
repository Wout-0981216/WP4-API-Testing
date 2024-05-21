import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivitiesPage = () => {
    const [activiteiten, setActiviteiten] = useState([]);

    useEffect(() => {
        // uit database halen
      axios.get('http://localhost:8000/game/api/activiteiten')
        .then(response => {
          setActiviteiten(response.data);
        })
        .catch(error => {
          console.error('Er is een fout opgetreden bij het ophalen van de activiteiten', error);
        });
    }, []);

    const handleSubmit = (activiteitId) => {
    // inlever knop
    }

    return (
        <div>
            <h1>Activiteiten</h1>
        </div>
    )
};

export default ActivitiesPage;