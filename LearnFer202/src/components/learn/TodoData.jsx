/* eslint-disable react/prop-types */
const TodoData = (props) => {
  // Destructuring props
  const { todoList, deleteTodo } = props;

  const handleClick = (id) => {
    deleteTodo(id);
  };


  return (
    <div className="todo-data">
      {todoList.map((item, index) => {
        return (
          <div key={item.id} className="todo-item">
            {item.id} - {item.name}
            <button
              onClick={() => handleClick(item.id)}
              style={{ cursor: "pointer" }}
            >
              Delete
            </button>
          </div>
        );
      })}
      {/* Static content outside the loop */}
    </div>
  );
};

export default TodoData;
