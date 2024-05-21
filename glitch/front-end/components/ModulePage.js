import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input, Icon, Button } from '@rneui/themed';

const ModulePage = () => {
  const[course_name, setCourse_name] = useState('');
  const[moduledict, setModule_dict] = useState('');
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
        const response = await fetch('http://127.0.0.1:8000/game/api/module/', {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            setCourse_name(data.module_list.course_name)
            setModule_dict(data.module_list)
        } catch (error) {
          console.error('Er is een fout opgetreden bij het ophalen van de gebruikers informatie', error);
        }
    };
    getCsrfToken();
    get_module_info();
  }, []);


  function ModuleCards() {
    const renderModules = () => {
      const modulelist = [];
      for (const module of moduledict) {
        modulelist.push(
        <div class="card" style={{boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)"}}>
          <div class="container" style={{padding: "2px 16px"}}>
            <h4><b>{moduledict.module_name}</b></h4>
            <p>{moduledict.activity1}</p>
            <p>{moduledict.activity2}</p>
            <p>Points Challenge     benodigde punten: {moduledict.points_challenge_points}</p>
            <p>{moduledict.context_challenge_name}</p>
            <p>{moduledict.core_assignment_name}</p>
          </div>
        </div>);
      }
      return <ul>{modulelist}</ul>;
    };
    return <div>{renderModules()}</div>;
  }

  return(
    <div>
      <h2>{course_name} Modules</h2>
        <ModuleCards />
    </div>
  )
}

export default ModulePage;

