import React, { createContext, ReactNode, useContext, useReducer, useState } from "react";

interface TodoContextType {
    todo: Todos[],
    addTodo: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    // toggleTodo: (id: number) => void,
    removeTodo: (text: string) => void,
    // completeAllTodos: () => void,
    // clearCompletedTodos: () => void,
    light: boolean,
    setLight:  React.Dispatch<React.SetStateAction<boolean>>,
    newTodo: string,
    setNewTodo: React.Dispatch<React.SetStateAction<string>>
}

interface Children {
    children: ReactNode
}

interface Todos {
    id?: number,
    text?: string,
    completed?: boolean,
}

interface Actions {
    type: string,
    payload: Todos,
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const ACTIONS = {
    ADD_TODO: 'ADD_TODO',
    TOGGLE_TODO: 'TOGGLE_TODO',
    REMOVE_TODO: 'REMOVE_TODO',
    COMPLETE_ALL_TODOS: 'COMPLETE_ALL_TODOS',
    CLEAR_COMPLETED_TODOS: 'CLEAR_COMPLETED_TODOS',
}
const todoAction = (todo: Todos[], action: Actions): Todos[] => {
    switch (action.type) {
        case ACTIONS.ADD_TODO:
            return [action.payload, ...todo]
        case ACTIONS.REMOVE_TODO:
            return todo.filter((r) => r.text !== action.payload.text);
        default:
            return todo;
    }
}

const todoState: Todos[] = []

export const TodoProvider: React.FC<Children> = ({ children }) => {
    const [todo, dispatch] = useReducer(todoAction, todoState);
    const [light, setLight] = useState<boolean>(false)
    const [newTodo, setNewTodo] = useState<string>('');

    const addTodo = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            dispatch({ type: ACTIONS.ADD_TODO, payload: { text: newTodo, completed: false } });
            setNewTodo('');
        }
    }

    const removeTodo = (text: string) => {
        dispatch({type: ACTIONS.REMOVE_TODO, payload: { text }})
    }

    return (
        <TodoContext.Provider value={{todo, addTodo, removeTodo, light, setLight, newTodo, setNewTodo}}>
            { children }
        </TodoContext.Provider>
    )
}

export const useTodo = (): TodoContextType => {
    const context = useContext(TodoContext);

    if(!context) {
        throw new Error('useTodo must be within a todo provider')
    }

    return context
}