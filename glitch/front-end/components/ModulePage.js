import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input, Icon, Button } from '@rneui/themed';

const ModulePage = ({course_id}) => {
  const[course_name, setCourse_name] = useState('');
  const[moduledict, setModule_dict] = useState({})
  const[nr_of_modules, setNr_of_modules] = useState('')
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

    const get_module_info = async () => {
      try{
        const response = await fetch(`http://127.0.0.1:8000/game/api/module/${course_id}/`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            setCourse_name(data.course_name);
            setNr_of_modules(data.nr_of_modules)
            setModule_dict(data.module_list)
        } catch (error) {
          console.error('Er is een fout opgetreden bij het ophalen van de gebruikers informatie', error);
        }
    };
    getCsrfToken();
    get_module_info();
  }, []);

  function Activities(activities) {
    const activities_array = []
    console.log(activities)
    for(let i=1; i <= nr_of_modules; i++){
      const activitynr = "activity"+i;
      console.log(activities["activities"][activitynr])
      activities_array.push(
        <p>{activities["activities"][activitynr]}</p>
      )
    }
    return(
      activities_array
    )
  }

  function ModuleCards() {
    const module_array = [];
    for(let i=1; i <= nr_of_modules; i++) {
      const modulenr = "module"+i;
      console.log(moduledict[modulenr])
      module_array.push(
      <div class="card" style={{boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)"}}>
        <div class="container" style={{padding: "2px 16px"}}>
          <h4><b>{moduledict[modulenr]["module_name"]}</b></h4>
          <Activities activities={moduledict[modulenr]["activities"]}/>
          <p>Points Challenge     benodigde punten: {moduledict[modulenr]["points_challenge_points"]}</p>
          <p>{moduledict[modulenr]["context_challenge_name"]}</p>
          <p>{moduledict[modulenr]["core_assignment_name"]}</p>
        </div>
      </div>);
    }
      return(
        <ul style={{listStyle: "none", display: "grid", "grid-template-columns": "auto auto auto", gap: "40px"}}>
          {module_array.map((module, index) => (
            <li key={index}>{module}</li>
          ))}
        </ul>
      )
  }

  return(
    <div>
      <h2>{course_name} Modules</h2>
        <ModuleCards/>
    </div>
  )
}

export default ModulePage;

