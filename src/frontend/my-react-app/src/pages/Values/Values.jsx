import React, { useEffect, useState } from 'react';

const Values = () => {
  const [values, setValues] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/values')
      .then(response => response.json())
      .then(data => {
        setValues(data);
      })
      .catch(error => {
        console.error('Error fetching values:', error);
      });
  }, []);

  return (
    <div>
      <h2>Values Page</h2>
      {/* <ul>
        {values.map((value, index) => (
          <li key={index}>{value}</li>
        ))}
      </ul> */}
    </div>
  );
};

export default Values;
