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

	async function getItems() {
		const requestOptions = { method: 'GET' };
		let response = await fetch(apiURL + username, requestOptions)
		if(response.ok) {
			// response passed
			let data = await response.json()
			setTodoList(data)
			return data
		
		} else {
			// response failed
			await response.json()
			setTodoList([])
			return []
		}
	}

	async function addItem(e) {
		if(e.code == "Enter") {
			if (todoList.length == 0) {
				// there are not items into the ToDo List
				await createFirstItem()
				let newTodoList = [...todoList, {label: task, done: false}]
				await updateItem(newTodoList)
				setTodoList(newTodoList)
				setTask("")
			} else {
				// there are items into the ToDo List
				let newTodoList = [...todoList, {label: task, done: false}]
				await updateItem(newTodoList)
				setTodoList(newTodoList)
				setTask("")
			}
		}
	}
	
	async function removeItem(index) {
		const newTodoList = [
			...todoList.slice(0, index),
			...todoList.slice(index + 1, todoList.length)
		];
		const raw = "";
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		const requestOptions = { method: 'DELETE', body: raw }
		let response = await fetch(apiURL + username, requestOptions)
		if(response.ok || response.status == "500 Internal Server Error") {
			await response.json()
			await createFirstItem()
			await updateItem(newTodoList)
			return setTodoList(newTodoList)
		} else {
			// response failed
			await response.json()
			console.log(response.status + ": " + response.statusText)

		}
	}

	async function checkTodo(index) {
		let newTodoList = [...todoList]
		newTodoList[index].done = !newTodoList[index].done
		if(await updateItem(newTodoList) != -1) {
			setTodoList(newTodoList)
		}
	}

	async function updateItem(todoList) {
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		const raw = JSON.stringify(todoList);
		const requestOptions = { method: 'PUT', headers: myHeaders, body: raw };

		let response = await fetch(apiURL + username, requestOptions)
		if(response.ok) {
			await response.json()
			return response
		} else {
			// response failed
			await response.json()
			console.log(response.status + ": " + response.statusText)
			return -1
		}
	}

	async function createFirstItem() {
		const myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		const raw = JSON.stringify([]);
		const requestOptions = { method: 'POST', headers: myHeaders, body: raw };
		let response = await fetch(apiURL + username, requestOptions)
		if(response.ok) {
			await response.json()
			return []
		} else {
			// response failed
			await response.json()
			console.log(response.status + ": " + response.statusText)
			return []
		}				
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
