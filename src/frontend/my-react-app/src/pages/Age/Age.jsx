import React, { useEffect, useState } from 'react';

const Age = () => {
  const [age, setAge] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/age')
      .then(response => response.json())
      .then(data => {
        setAge(data.age);
      })
      .catch(error => {
        console.error('Error fetching age:', error);
      });
  }, []);

  return (
    <div>
      <h2>Age Page</h2>
      <p>Age: {age}</p>
    </div>
  );
};

export default Age;
