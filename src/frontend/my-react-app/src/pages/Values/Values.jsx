import React, { useContext, useEffect, useState } from 'react';
import UserDetailsContext from '../../context/userDetailsContext';
// import Submit from './Submit';

// submit button should send a json of all values

const Values = () => {
  // const [values, setValues] = useState([]);

  // const handleAdd = (event) => {
  //   console.log("in handleAdd")
  //   var updatedValues = [...values]
  //   updatedValues.push(event.target.name)
  //   // if (values)
  //   // const { newValue, checked } = event.target;
  //   // const updatedValues = checked
  //   //   ? [...localValues, newValue]
  //   //   : localValues.filter(value => value !== newValue);
  //   // console.log("After pushing checkbox value to array, we get: ", updatedValues.length)
  //   if (values.includes(event.target.name)) {
  //     updatedValues = updatedValues.filter(value => value !== event.target.name)
  //   }
  //   setValues(updatedValues);
  //   console.log("new values from state: ");
  //   for (let i = 0; i < updatedValues.length; i++) {
  //     console.log(updatedValues[i])
  //   }
  // };

  // // useEffect(() => {
  // //   fetch('http://localhost:5000/values')
  // //     .then(response => response.json())
  // //     .then(data => {
  // //       setValues(data);
  // //     })
  // //     .catch(error => {
  // //       console.error('Error fetching values:', error);
  // //     });
  // // }, []);

  // return (
  //   <div>
  //     <h2>Values Form</h2>
  //     <div>
  //       <label>
  //         <input
  //           type="checkbox"
  //           name="Kindness"
  //           checked={values.includes("Kindness")}
  //           onChange={handleAdd}
  //         />
  //         Kindness
  //       </label>
  //     </div>
  //     <div>
  //       <label>
  //         <input
  //           type="checkbox"
  //           name="Cooperation"
  //           checked={values.includes("Cooperation")}
  //           onChange={handleAdd}
  //         />
  //         Cooperation
  //       </label>
  //     </div>
  //     <div>
  //       <label>
  //         <input
  //           type="checkbox"
  //           name="Honesty"
  //           checked={values.includes("Honesty")}
  //           onChange={handleAdd}
  //         />
  //         Honesty
  //       </label>
  //     </div>
  //     {/* <button onClick={SendUserData}>Submit</button> */}
  //   </div>
  // );

  const { values, setValues } = UserDetailsContext();

  const handleValuesChange = (newValue) => {
    setValues(newValue)
    console.log("new values: ", values)
  }

  return (
    <p>
      Values:{" "}
      <input value={values} onChange={(ev) => handleValuesChange(ev.target.value)} />
      {/* <Submit /> */}
    </p>
  );
};

export default Values;

// original branch sending data code

//   const SendUserData = async () => {
//     const data = useContext(UserDetailsContext)
//     console.log("this is the data we're about to send: ", data)
//     // console.log("this is the age we're about to send: ", UserDetailsContext.Provider.age)
//     const userData = {
//       age: data.age,
//       value_list: ['test713', 'test7131', 'test7132']
      
//     }
    // try {
    //   console.log("Sending user data: ")
    //   // console.log()
    //   const response = await fetch('http://localhost:5000/send_user_data', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(userData)
    //   })

    //   // console.log(response)
    //   console.log("About to submit ")

    //   if (response.ok) {
    //     console.log("Data submitted successfully");
    //   } 
    //   else {
    //     console.log("Failed to submit data");
    //   }
    // }

    // catch(error) {
    //   console.error("Error submitting data:", error)
    // }
  // }

