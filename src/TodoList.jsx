import { useState } from "react";
import { useRef } from 'react'

import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [todo, setTodo] = useState({
        desc: "",
        priority: "",
        date: new Date()
    });
    const gridRef = useRef();

    const [columnDefs] = useState([
        { field: 'desc', sortable: false, filter: true },
        {
            field: 'priority', filter: true,
            cellStyle: params => params.value === "High" ? { color: 'red' } : { color: 'black' }
        },

        { field: 'date', filter: true }
    ]);

    const handleSubmit = (event) => {
        event.preventDefault();
        addTodo()
        setTodo({
            desc: "",
            priority: "",
        });
    };

    const changeDate = (newDate) => {
        setTodo({...todo, date: newDate})
    };

    const addTodo = () => {
        setTodos([...todos, todo]);

    };

    const handleDelete = () => {
        if (gridRef.current.getSelectedNodes().length > 0) {
            setTodos(todos.filter((todo, index) =>
                index != gridRef.current.getSelectedNodes()[0].id))
        }
        else {
            alert('Select a row first!');
        }
    };
    console.log(todo.date)

    return (
        <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <form onSubmit={handleSubmit}>
                    <Stack mt={2} direction="row" spacing={2} justifyContent="center" alignItems="center">
                        <TextField
                            label="Description"
                            onChange={e => setTodo({ ...todo, desc: e.target.value })}
                            value={todo.desc} />
                        <TextField
                            label="Priority"
                            onChange={e => setTodo({ ...todo, priority: e.target.value })}
                            value={todo.priority} />
                        <DatePicker 
                            label="Date"
                            format="DD/MM/YYYY"
                            value={dayjs(todo.date) ?? null} 
                            onChange={(date) => changeDate(date)} />

                        <Button variant="contained" type="submit" value="add">Add</Button>
                        <Button onClick={handleDelete}>Delete</Button>
                    </Stack>
                    <div className="ag-theme-material" style={{ width: 700, height: 500 }}>
                        <AgGridReact
                            ref={gridRef}
                            onGridReady={params => gridRef.current = params.api}
                            rowData={todos}
                            columnDefs={columnDefs}
                            rowSelection="single"
                        />
                    </div>
                </form >
            </LocalizationProvider>
        </>
    );
}

export default TodoList;