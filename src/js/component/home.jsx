import React, {useState, useRef, useEffect} from "react";
import { Title } from "./title.jsx";


//create your first component
const Home = () => {
	const ref = useRef(null);
	const [task, setTask] = useState("");
	const [todoList, setTodoList] = useState([]);
	const apiURL = "https://assets.breatheco.de/apis/fake/todos/user/";
	const username = "yanzacd"

	useEffect(() => {
		getItems()
	}, [])

	function getItems() {
		const requestOptions = {
			method: 'GET'
		  };
		  
		  fetch(apiURL + username, requestOptions)
			.then( response => {
				if(response.ok) {
					// response passed
					return response.json()
				} else if(response.status == "404"){
					return [].json()
				} else {
					// response failed
					console.log(response.status + ": " + response.statusText)
				}
			})
			.then(data => {
				setTodoList(data)
			})
			.catch(error => console.log('error', error));
	}

	function addItem(e) {
		if(e.code =="Enter") {
			/*const myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");
			const raw = JSON.stringify([]);
			const requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: raw
			};

			fetch(apiURL + username, requestOptions)
			.then(response => response.text())
			.then(result => console.log(result))
			.catch(error => console.log('error', error));*/

			setTodoList(todoList => [...todoList, {label: task, done: false}])
			setTask("")
		}
	}
	
	function removeItem(index) {
		setTodoList([
			...todoList.slice(0, index),
			...todoList.slice(index + 1, todoList.length)
		  ]);
	}

	function checkTodo(index) {
		let newTodoList = [...todoList]
		newTodoList[index].done = !newTodoList[index].done
		setTodoList(newTodoList)
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
								<div>
									<input className="form-check-input me-3" type="checkbox" value="" checked={todo.done} id="flexCheckDefault" onChange={() => checkTodo(index)} />
									{todo.label}
								</div>
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
