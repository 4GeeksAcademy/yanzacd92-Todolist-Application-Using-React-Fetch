import React, {useState, useRef} from "react";
import { Title } from "./title.jsx";


//create your first component
const Home = () => {
	const ref = useRef(null);
	const [task, setTask] = useState("");
	const [todoList, setTodoList] = useState([]);

	function addItem(e) {
		if(e.code =="Enter") {
			setTodoList(todoList => [...todoList, task])
			setTask("")
		}
	}
	
	function removeItem(index) {
		setTodoList([
			...todoList.slice(0, index),
			...todoList.slice(index + 1, todoList.length)
		  ]);
	}

	return (
		<div>
			<Title />
			<div className="card">
				<div className="card-header">
				<input ref={ref} type="text" className="form-control" id="inputControl" 
					placeholder="What needs to be done?"
					value={task} onChange={(e) => setTask(e.target.value)}
					onKeyDown={addItem}/>
				</div>
				<ul className="list-group list-group-flush">
					{
						todoList.map((todo, index) => (
							<li key={index} className="list-group-item d-flex justify-content-between align-item-center">
								{todo}
								<button type="button" onClick={() => removeItem(index)} className="badge rounded-pill">x</button>
							</li>
						))
					}
				</ul>
				<div className="card-footer">
					{todoList.length} item left
				</div>
			</div>
		</div>
	);
};

export default Home;
