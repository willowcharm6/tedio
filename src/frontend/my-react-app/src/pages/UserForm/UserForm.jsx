import Age from "../Age/Age";
import Submit from "../Values/Submit";
import Values from "../Values/Values";

const UserForm = () => {
    // const HandleSubmit = () => {
    //     const { age, values } = UserDetailsContext();
    //     console.log(age)
    //     console.log(values)
    // }

    return (
        <div>
            <Values />
            <Age />
            <Submit />
        </div>
    )
};

export default UserForm;