import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Assignment = () => {
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        axios.get('http://192.168.56.1:8000/game/api/concept-opdrachten/')
            .then(response => {
                setAssignments(response.data);
            })
            .catch(error => {
                console.error('Er is een fout opgetreden bij het ophalen van de data:', error);
            });
    }, []);

    return (
        <div>
            <h1>Opdrachten</h1>
            <ul>
                {assignments.map(assignment => (
                    <li key={assignment.id}>
                        <h2>{assignment.naam}</h2>
                        <p>{assignment.beschrijving}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Assignment;
