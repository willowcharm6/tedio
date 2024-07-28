import React, { useContext, useEffect, useState } from 'react';
import UserDetailsContext from '../../context/userDetailsContext';

// submit button should send a json of just age

const Age = () => {
  const {age, setUserDetails } = useContext(UserDetailsContext)
  const [localAge, setLocalAge] = useState('');

  const handleAgeChange = (newAge) => {
    setLocalAge(newAge);
    setUserDetails({ age: newAge });
    console.log("new age from state: ", newAge);
  }

  useEffect(() => {
    console.log("UserDetailsContext updated:", { age, setUserDetails });
  }, [age, setUserDetails]);

  // useEffect(() => {
  //   fetch('http://localhost:5000/api/age')
  //     .then(response => response.json())
  //     .then(data => {
  //       setAge(data.age);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching age:', error);
  //     });
  // }, []);

  return (
    // <UserDetailsContext.Provider value={age}>
    <div>
      <h2>Age Form</h2>
      <label>Age:</label>
      <input
        type='text'
        value={localAge}
        onChange={(e) => handleAgeChange(e.target.value)}
      />
    </div>
    // </UserDetailsContext.Provider>
  );
};

export default Age;
