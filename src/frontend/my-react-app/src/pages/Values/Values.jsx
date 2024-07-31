import React, { useContext, useEffect, useState } from 'react';
import UserDetailsContext from '../../context/userDetailsContext';

// submit button should send a json of all values

const Values = () => {
  const { values, setUserDetails } = useContext(UserDetailsContext)
  const [localValues, setLocalValues] = useState([]);

  // useEffect(() => {
  //   fetch('http://localhost:5000/values')
  //     .then(response => response.json())
  //     .then(data => {
  //       setValues(data);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching values:', error);
  //     });
  // }, []);

  // useEffect(() => {
  //   console.log("UserDetailsContext updated:")
  //   for (let i = 0; i < length(values); i++) {
  //     console.log(values[i]);
  //   }
  // })

  const handleAdd = (event) => {
    console.log("in handleAdd")
    var updatedValues = [...localValues]
    updatedValues.push(event.target.name)
    // if (values)
    // const { newValue, checked } = event.target;
    // const updatedValues = checked
    //   ? [...localValues, newValue]
    //   : localValues.filter(value => value !== newValue);
    // console.log("After pushing checkbox value to array, we get: ", updatedValues.length)
    if (localValues.includes(event.target.name)) {
      updatedValues = updatedValues.filter(value => value !== event.target.name)
    }
    setLocalValues(updatedValues);
    setUserDetails({ values: updatedValues });
    console.log("new values from state: ");
    for (let i = 0; i < updatedValues.length; i++) {
      console.log(updatedValues[i])
    }
  };

  const SendUserData = async () => {
    const data = useContext(UserDetailsContext)
    console.log("this is the data we're about to send: ", data)
    // console.log("this is the age we're about to send: ", UserDetailsContext.Provider.age)
    const userData = {
      age: data.age,
      value_list: ['test713', 'test7131', 'test7132']
      
    }
    try {
      console.log("Sending user data: ")
      // console.log()
      const response = await fetch('http://localhost:5000/send_user_data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })

      // console.log(response)
      console.log("About to submit ")

      if (response.ok) {
        console.log("Data submitted successfully");
      } 
      else {
        console.log("Failed to submit data");
      }
    }

    catch(error) {
      console.error("Error submitting data:", error)
    }
  }

  // useEffect(() => {
  //   console.log("UserDetailsContext updated:", { values, setUserDetails });
  //   for (let i = 0; i < values.length; i++) {
  //     console.log(values[i])
  //   }
  // }, [values, setUserDetails]);


  return (
    <div>
      <h2>Values Form</h2>
      <div>
        <label>
          <input
            type="checkbox"
            name="Kindness"
            checked={localValues.includes("Kindness")}
            onChange={handleAdd}
          />
          Kindness
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="Cooperation"
            checked={localValues.includes("Cooperation")}
            onChange={handleAdd}
          />
          Cooperation
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="Honesty"
            checked={localValues.includes("Honesty")}
            onChange={handleAdd}
          />
          Honesty
        </label>
      </div>
      <button onClick={SendUserData}>Submit</button>
    </div>
  );
};


export default Values;
