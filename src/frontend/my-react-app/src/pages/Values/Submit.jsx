import UserDetailsContext from "../../context/userDetailsContext"
import Age from "../Age/Age";
import Values from "./Values";

const Submit = () => {
    const { age, values } = UserDetailsContext();

    const HandleSubmit = () => {
        console.log(age)
        console.log(values)
    }



    // return (<button onClick={HandleSubmit}>Submit</button>);
    return (
        <p>
            Age: {age}
            Values: {values}
        </p>
    )
};

// const Test = () => (
//   <>
//     <Age />
//     <Values />
//     <Submit />
//   </>
// );
export default Submit