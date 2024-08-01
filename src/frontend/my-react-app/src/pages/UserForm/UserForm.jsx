// import Age from "../Age/Age";
// import Submit from "../Values/Submit";
// import Values from "../Values/Values";
// import UserDetailsState from "../../context/userDetailsContext";
import { useBetween } from 'use-between'
import { useState } from 'react';

const UserForm = () => {
    // const HandleSubmit = () => {
    //     const { age, values } = UserDetailsContext();
    //     console.log(age)
    //     console.log(values)
    // }

    const UserDetailsState = () => {
        const [age, setAge] = useState("");
        const [values, setValues] = useState("");
        return {
          age,
          setAge,
          values,
          setValues
        };
    };

    const useSharedFormState = () => useBetween(UserDetailsState);

    const Age = () => {

        // const handleAgeChange = (newAge) => {
        //   setAge(newAge)
        //   console.log("new age: ", age)
        // }
      
        const { age, setAge } = useSharedFormState();
        return (
          <p>
            Age:{" "}
            <input value={age} onChange={(ev) => setAge(ev.target.value)} />
          </p>
        );
      };

    const Values = () => {
        const { values, setValues } = useSharedFormState();
        
        // const handleValuesChange = (newValue) => {
        //     setValues(newValue)
        //     console.log("new values: ", values)
        // }
        
        return (
            <p>
                Values:{" "}
                <input value={values} onChange={(ev) => setValues(ev.target.value)} />
            </p>
        );
    };

    const Submit = () => {
        const { age, values } = useSharedFormState();
    
        // const HandleSubmit = () => {
        //     console.log(age)
        //     console.log(values)
        // }
    
    
    
        // return (<button onClick={HandleSubmit}>Submit</button>);
        return (
            <p>
                Age: {age} <br />
                Values: {values}
            </p>
        )
    };

    return (
        <div>
            <Values />
            <Age />
            <Submit />
        </div>
    )
};

export default UserForm;