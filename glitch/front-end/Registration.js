import React, {useState, useEffect} from 'react';

const RegistrationForm = () => {
    const[first_name, setFirst_name] = useState('');
    const[last_name, setLast_name] = useState('')
    const[username, setUsername] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [csrftoken, setCsrfToken] = useState('');

    useEffect(() => {
        const getCsrfToken = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/authentication/api/csrf/', {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();
                setCsrfToken(data.csrfToken);
            } catch (error) {
                console.error('Er is een fout opgetreden bij het ophalen van de CSRF-token:', error);
            }
        };

        getCsrfToken();
    }, []);

    const submitForm = async (first_name,last_name,username, email, password) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/authentication/api/register/', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
                },
                credentials: 'include',
                body: JSON.stringify({ first_name,last_name,username, email, password }),
            });
            const data = await response.json();
          if  (response.ok) {
            setTimeout(() => {
                setSuccessMessage('Succesvol geregistreerd');
                window.location.href = 'http://127.0.0.1:8000/';
            }, 1000);} else {
              throw new Error('Network not OK');
            }
        } catch (error) {
            console.error('Er is een fout opgetreden bij het registreren van de gebruiker:', error);
            setError('fout');
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
    
        submitForm(first_name,last_name,username, email, password);
        setUsername('');
        setEmail('');
        setPassword('');
    };

    return (
        <div>
          {error || successMessage ? (
          <p>{error ? error : successMessage}</p>) : null}

          <h2>Registratieformulier</h2>
          <div>
              <label>Voornaam:</label>
              <input
                type="first_name"
                value={first_name}
                onChange={(e) => setFirst_name(e.target.value)}
              />
            </div>
          <div>
              <label>Achternaam:</label>
              <input
                type="last_name"
                value={last_name}
                onChange={(e) => setLast_name(e.target.value)}
              />
            </div>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Gebruikersnaam:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label>Wachtwoord:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit">Registreren</button>
          </form>
        </div>
      );
};

export default RegistrationForm;