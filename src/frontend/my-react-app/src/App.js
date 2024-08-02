import React, { useState } from "react";
import { useBetween } from "use-between";

// Make a custom hook with your future shared state
const useFormState = () => {
  const [age, setAge] = useState("");
  const [values, setValues] = useState("");
  return {
    age,
    setAge,
    values,
    setValues
  };
};

// Make a custom hook for sharing your state between any components
const useSharedFormState = () => useBetween(useFormState);

const Age = () => {
  // Use the shared hook!
  const { age, setAge } = useSharedFormState();
  return (
    <p>
    <h2>Age Form</h2>
      Age:{" "}
      <input value={age} onChange={(ev) => setAge(ev.target.value)} />
    </p>
  );
};

const Values = () => {
  // Use  the shared hook!
    const { values, setValues } = useSharedFormState();
    const handleAdd = (event) => {
        console.log("in handleAdd")
        var updatedValues = [...values]
        updatedValues.push(event.target.name)
        if (values.includes(event.target.name)) {
            updatedValues = updatedValues.filter(value => value !== event.target.name)
        }
        setValues(updatedValues);
        console.log("new values from state: ");
        for (let i = 0; i < updatedValues.length; i++) {
            console.log(updatedValues[i])
        }
    };

    return (
        <div>
        <h2>Values Form</h2>
        <div>
            <label>
            <input
                type="checkbox"
                name="Kindness"
                checked={values.includes("Kindness")}
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
                checked={values.includes("Cooperation")}
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
                checked={values.includes("Honesty")}
                onChange={handleAdd}
            />
            Honesty
            </label>
        </div>
            {/* <button onClick={SendUserData}>Submit</button> */}
        </div>
    );
};


const SendUserData = () => {
    const { values, age } = useSharedFormState();
    const HandleSubmit = async () => {
        const userData = {
            age: age,
            value_list: values
        }
        try {
            console.log("Sending user data: ")
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
    return (<button onClick={HandleSubmit}>Submit</button>);
};

export const Test = () => (
  <>
    <Age />
    <Values />
    <SendUserData />
  </>
);
