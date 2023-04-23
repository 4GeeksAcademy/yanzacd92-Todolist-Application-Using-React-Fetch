import React, {useState, useRef, useEffect} from "react";
import { Title } from "./title.jsx";
import { any } from "prop-types";


//create your first component
const Home = () => {
	const ref = useRef(null);
	const [task, setTask] = useState("");
	const [todoList, setTodoList] = useState([]);
	const apiURL = "https://assets.breatheco.de/apis/fake/todos/user/";
	const username = "yanzacd"

	useEffect(() => {
		getItems()
	}, [addItem(any)])

	function getItems() {
		const requestOptions = { method: 'GET' };
		fetch(apiURL + username, requestOptions)
		.then( response => {
			if(response.ok) {
				// response passed
				return response.json()
			
			} else {
				// response failed
				return []
			}
		})
		.then(data => {
			setTodoList(data)
		})
		.catch(error => console.log('error', error));
	}

	function addItem(e) {
		if(e.code == "Enter") {
			if (todoList.length == 0) {
				// if there are items into the ToDo List
				let newTodoList = createFirstItem()
				setTodoList(newTodoList)
				setTask("")
			} else {
				// there are items into the ToDo List
				let newTodoList = [...todoList, {label: task, done: false}]
				updateItem(newTodoList)
				setTodoList(newTodoList)
				setTask("")
			}
		}
	}
	
	function removeItem(index) {
		const newTodoList = [
			...todoList.slice(0, index),
			...todoList.slice(index + 1, todoList.length)
		];
		const raw = "";
		const requestOptions = { method: 'DELETE', body: raw }

		fetch(apiURL + username, requestOptions)
		.then(response => {
			if(response.ok || response.status == "500 Internal Server Error") {
				if(updateItem(newTodoList) != -1) {
					return setTodoList(newTodoList)
				}
				return
			} else {
				// response failed
				console.log(response.status + ": " + response.statusText)
			}
		})
		.catch(error => console.log('error', error));
	}

	function checkTodo(index) {
		let newTodoList = [...todoList]
		newTodoList[index].done = !newTodoList[index].done
		if(updateItem(newTodoList) != -1) {
			setTodoList(newTodoList)
		}
	}

	function updateItem(todoList) {
		console.log("UPDATE ITEM:  " + todoList)
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		const raw = JSON.stringify(todoList);
		const requestOptions = { method: 'PUT', headers: myHeaders, body: raw };

		fetch(apiURL + username, requestOptions)
		.then(response => {
			if(response.ok) {
				return response
			} else {
				// response failed
				console.log(response.status + ": " + response.statusText)
				return -1
			}
		})
		.catch(error => {
			console.log('error', error)
			return -1
		});
	}

	function createFirstItem() {
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		const raw = JSON.stringify([]);
		const requestOptions = { method: 'POST', headers: myHeaders, body: raw };
		fetch(apiURL + username, requestOptions)
		.then(response => {
			if(response.ok) {
				return response.json
			} else {
				// response failed
				console.log(response.status + ": " + response.statusText)
				return []
			}				
		})
		.catch(error => console.log('error', error));
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
						todoList?.map((todo, index) => (
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
					{todoList?.length} item left
				</div>
			</div>
		</div>
	);
};

export default Home;
