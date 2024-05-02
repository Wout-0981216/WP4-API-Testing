import React, {useState} from 'react';

const RegistrationForm = () => {
    const[username, setUsername] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');

    const submitForm = async (username, email, password) => {
        try {
            const response = await fetch('/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Er is een fout opgetreden bij het registreren van de gebruiker:', error);
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
    
        submitForm(username, email, password);
        setUsername('');
        setEmail('');
        setPassword('');
    };

    return (
        <div>
          <h2>Registratieformulier</h2>
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