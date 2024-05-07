import React, {useState, useEffect} from 'react';

const ProfilePage = () => {
  const[first_name, setFirst_name] = useState('');
  const[last_name, setLast_name] = useState('')
  const[username, setUsername] = useState('');
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[date_joined, setDate_joined] = useState('');
  const[csrftoken, setCsrfToken] = useState('');


  useEffect(() => {
    const getCsrfToken = async () => {
      try {
          const response = await fetch('http://127.0.0.1:8000/game/api/csrf/', {
              method: 'GET',
              credentials: 'include',
          });
          const data = await response.json();
          setCsrfToken(data.csrfToken);
      } catch (error) {
          console.error('Er is een fout opgetreden bij het ophalen van de CSRF-token:', error);
      }
    };

    const getUserInfo = async () => {
      try{
        const response = await fetch('http://127.0.0.1:8000/game/api/profile/', {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            setFirst_name(data.first_name);
            setLast_name(data.last_name);
            setUsername(data.username);
            setEmail(data.email);
            setPassword(data.password);
            setDate_joined(data.date_joined);
        } catch (error) {
          console.error('Er is een fout opgetreden bij het ophalen van de gebruikers informatie', error);
        }
    };
    
    getCsrfToken();
    getUserInfo();
  }, []);

  const submitForm = async (first_name,last_name,username, email, password) => {
    try {
        console.log('CSRF-token:', csrftoken);
        const response = await fetch('http://127.0.0.1:8000/game/api/profile/', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
            },
            credentials: 'include',
            body: JSON.stringify({ first_name,last_name,username, email, password }),
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Er is een fout opgetreden bij het aanpassen van het profiel:', error);
    }
};

const handleSubmit = (e) => {
    e.preventDefault();

    submitForm(first_name,last_name,username, email, password);
};
  return (
    <div>
      <h2>Profiel pagina</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Voornaam:</label>
          <input
            type="text"
            value={first_name}
            onChange={(e) => setFirst_name(e.target.value)}
          />
        </div>
        <div>
          <label>Achternaam:</label>
            <input
              type="text"
              value={last_name}
              onChange={(e) => setLast_name(e.target.value)}
            />
        </div>
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
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        <div>
          Gebruiker sinds: {date_joined}
        </div>
        <button type="submit">Gegevens aanpassen</button>
      </form>
    </div>
  );
};

export default ProfilePage;