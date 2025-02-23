/* eslint-disable react/prop-types */
import { useState } from "react";

const TodoNew = (props) => {
  //useState hook (getter/setter)
  // const valueInput = "eric";
  const [valueInput, setValueInput] = useState("Việt Đặng");
  const { addNewTodo } = props;
  // addNewTodo("eric") //fire
  const handleClick = () => {
    addNewTodo(valueInput);
  };

  const handleOnChange = (name) => {
    setValueInput(name);
  };
  return (
    <div className="todo-new">
      <input
        type="text"
        onChange={(event) => handleOnChange(event.target.value)}
      />
      <button style={{ cursor: "pointer" }} onClick={handleClick}>
        Add
      </button>
    </div>
  );
};

export default TodoNew;
