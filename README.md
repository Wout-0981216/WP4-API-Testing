# wp4-2024-starter
Template voor WP4 opdracht 2024 "GLITCH". Vul dit document aan zoals beschreven in eisen rondom opleveren (zie GLITCH-assignment.pdf)

# Installatie
Helaas moet het op deze wijze, bij het maken van dit document hebben we uiteraard rekening gehouden met docker maar hij bleef maar niet werken na echt uren en uren werken priegelen. Heel raar want hij forwarde port 8081 wel maar 8000 terwijl het precies hetzelfde is. Dit berichtje is geschreven om 02:30 na echt uren gewerkt te hebben. Alleen al bij het opstarten van docker desktop bleven er errors komen, daarom hebben we hem heel vaak moeten installeren, er was iets fout met onze laptop. De applicatie werkt op mobiel. Daarvoor heb ik nu de links geupdate. Zie ook de docker files en yaml bestanden om te kijken hoe we het geprobeerd hebben. Daarvoor moest eigenlijk overal in het project bij 192.168.56.1:8000, 0.0.0.0:8000 staan. 


Backup plan (helaas):

Open 2 terminals:
Terminal 1:
- python -m venv venv
- cd venv
- cd Scripts
- activate
- cd ..
- cd ..
- cd glitch
- pip install requirements.txt
- python manage.py runserver 192.168.56.1:8000

Terminal 2:
- cd glitch
- cd front-end
- npm install
- npm start


# bronnen
Ai (chatgpt) prompts:
- "Hoe verdeel ik mijn scherm met View in 2 delen, werkt het hetzelfde als een div?"
- "Hoe stuur ik data mee in postman"
- "Zorg dat mijn loginpage werkt met axios en tokens zoals de code van (https://medium.com/@ronakchitlangya1997/jwt-authentication-with-react-js-and-django-c034aae1e60d), leg daarna uit wat je doet"
- "Hoe zorg ik dat mijn home-page alleen zichtbaar is als ik ben ingelogd met de goede token?"
- "Hoe gebruik ik een Authprovider in mijn project"
- "Wat moet ik in de app.js en loginform.js zoals hier aanpassen om aan react native te voldoen? Leg het graag makkelijk uit"
- "Zorg ervoor dat als ik niet ingelogd ben ik een andere app zie dan de normale app, ik zie namelijk nu elke keer als ik de app opstart heel kort mijn inlogscherm"
- "Hoe validate ik jwt tokens voordat een pagina wordt geladen?"
- "Zorg ervoor dat ik na 5 minuten niet wordt uitgelogd, gebruik de refreshtokens, dit is mijn code {mijn code op 5/21/2024}"
- "Ik wil mijn courseheader om de keer links of rechts uigelijnd worden en het icoontje dan daar afhankelijk van links of rechts hebben staan"
- (meerdere prompts om alle mui elementen om te zetten naar native elementen omdat we niet wisten dat die alleenmaar bij web gebruikt konden worden)
- "zoek het verschil tussen CoreAssignment.js en assignment.js (codes gekopieerd)"


Youtube:
- https://www.youtube.com/watch?v=GnhbZbPb6uo
- https://www.youtube.com/watch?v=eXrwF4LXF5c&t=952s
- https://www.youtube.com/watch?v=iM5xEdair20
- https://www.youtube.com/watch?v=A39cBW-WJ7Q

Overige websites:
- https://medium.com/@ronakchitlangya1997/jwt-authentication-with-react-js-and-django-c034aae1e60d
- https://www.w3schools.com/react/react_router.asp
- https://reactnativeelements.com/
- https://marmelab.com/react-admin/AuthProviderWriting.html
- https://marmelab.com/react-admin/Authentication.html
- https://dev.to/sanjayttg/jwt-authentication-in-react-with-react-router-1d03?utm_source=reactdigest&utm_medium=&utm_campaign=1655
- https://reactnavigation.org/docs/getting-started/
- https://m2.material.io/design/typography/the-type-system.html#type-scale
- https://www.w3schools.com/react/react_jsx.asp 
- https://www.w3schools.com/django/index.php


Login gegevens:
- Docent:
  - gebruikersnaam: teacher
  - wachtwoord: teacher

- Studenten:
  - gebrukersnaam: student1
  - wachtwoord: student1

  - gebrukersnaam: student2
  - wachtwoord: student2

  - gebrukersnaam: student3
  - wachtwoord: student3