import React, { useContext, useState } from 'react';
import UserDetailsContext from '../../context/userDetailsContext';

// submit button should send a json of just age

const Age = () => {
  const {setUserDetails } = useContext(UserDetailsContext)
  const [age, setAge] = useState('');

  const handleAgeChange = (age, newAge) => {
    setAge(newAge)
    console.log("new age: ", age)
  }

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
    <UserDetailsContext.Provider value={age}>
    <div>
      <h2>Age Form</h2>
      <label>Age:</label>
      <input
        type='text'
        value={age}
        onChange={(e) => handleAgeChange(age, e.target.value)}
      />
    </div>
    </UserDetailsContext.Provider>
  );
};

export default Age;
