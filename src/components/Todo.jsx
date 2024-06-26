import React, { useState, useEffect } from 'react';
import { Trash3Fill, PencilSquare, PlusCircle, Trash2Fill } from "react-bootstrap-icons";
import { Modal, Button, Form } from 'react-bootstrap';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

const GetLocalTodo = () => {
    let AllPreviousTodos = localStorage.getItem("list");
    if (AllPreviousTodos) {
        return JSON.parse(AllPreviousTodos);
    } else {
        return [];
    }
}

function Todo() {
    const [input, setInput] = useState('');
    const [todo, setTodo] = useState(GetLocalTodo());
    const [updateData, setUpdateData] = useState(null);
    const [IsToggle, setToggle] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [userName, setUserName] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(true);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const AddItem = (e) => {
        e.preventDefault();

        if (!input.trim()) {
            alert("Please fill input value");
            return;
        }

        if (updateData) {
            setTodo(todo.map((item) => {
                if (item.id === updateData) {
                    return { ...item, name: input }
                }
                return item;
            }));
            setUpdateData(null);
        } else {
            const newTodo = { id: Math.random(), name: input };
            setTodo([...todo, newTodo]);
        }
        setInput('');
        setIsPopupOpen(false); 
    }

    const handleNameInputChange = (e) => {
        setNameInput(e.target.value);
    };

    const DeleteItem = (item) => {
        const updatedTodo = todo.filter((e) => e.id !== item.id);
        setTodo(updatedTodo);
        localStorage.setItem('list', JSON.stringify(updatedTodo));
    }

    const EditItem = (item) => {
        setInput(item.name);
        setUpdateData(item.id);
        setToggle(false);
        handleShow();
    }

    const handleNameSubmit = () => {
        setUserName(nameInput);
        setIsPopupOpen(false);
    };

    const resetAll = () => {
        setTodo([]);
        localStorage.removeItem('list');
    };

    useEffect(() => {
        localStorage.setItem("list", JSON.stringify(todo));
    }, [todo])

    return (
        <div className="container">
            <Popup open={isPopupOpen} onClose={() => setIsPopupOpen(false)} closeOnDocumentClick={false}>
                <div className="popup-content">
                    <h2>Welcome!</h2>
                    <label htmlFor="name">Enter your name:</label>
                    <input
                        id="name"
                        type="text"
                        value={nameInput}
                        onChange={handleNameInputChange}
                    />
                    <button onClick={handleNameSubmit} className='submit-button'>Submit</button>
                </div>
            </Popup>
            <div className='in-container'>         
                  {userName && <h1>Welcome, {userName}!</h1>}
            <form className='formClass d-flex justify-content-center'>
                <div className='form-group'>
                    <input type="text" className="form-control" placeholder='Add a task' onChange={(e) => {
                        setInput(e.target.value);
                    }} value={input}></input>
                </div>
                <div className='button-group'>
                    <Button variant="primary" onClick={AddItem}>
                        {IsToggle ? <PlusCircle /> : <PencilSquare />}
                    </Button>
                    <Button variant='danger' onClick={resetAll}>
                        <Trash2Fill />
                    </Button>
                </div>
            </form>
            </div>
 

            <div className='todo-list'>
                {Array.isArray(todo)&& todo.length>0? (
                    todo.map((e) => (
                        <div key={e.id} className="todo-item">
                            <input type="text" className="form-control-plaintext" value={e.name} disabled />
                            <div className='action-buttons'>
                                <Button variant="warning" onClick={() => EditItem(e)}>
                                    <PencilSquare />
                                </Button>
                                <Button variant="danger" onClick={() => DeleteItem(e)} className='delete'>
                                    <Trash3Fill />
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No todos yet. Add one!</p>
                )}
            </div>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Todo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Todo</Form.Label>
                            <Form.Control type="text" placeholder="Enter todo" value={input} onChange={(e) => setInput(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={AddItem}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Todo;
