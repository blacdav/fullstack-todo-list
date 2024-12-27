import React, { createContext, ReactNode, useContext, useReducer, useState } from "react";

interface TodoContextType {
    todo: Todos[],
    addTodo: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    completeTodo: (text: string) => void,
    removeTodo: (text: string) => void,
    allTodo: () => void,
    activeTodos: () => void,
    completedTodos: () => void,
    clearCompletedTodos: () => void,
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
    payload?: Todos,
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const ACTIONS = {
    ADD_TODO: 'ADD_TODO',
    TOGGLE_TODO: 'TOGGLE_TODO',
    REMOVE_TODO: 'REMOVE_TODO',
    COMPLETE_TODO: 'COMPLETE_TODO',
    ALL_TODOS: 'ALL_TODOS',
    ACTIVE_TODOS: 'ACTIVE_TODOS',
    COMPLETED_TODOS: 'CLEAR_COMPLETED_TODOS',
    CLEAR_COMPLETED_TODOS: 'CLEAR_COMPLETED_TODO'
}
const todoAction = (todo: Todos[], action: Actions): Todos[] => {
    switch (action.type) {
        case ACTIONS.ADD_TODO:
            return [action.payload!, ...todo]
        case ACTIONS.REMOVE_TODO:
            return todo.filter((r) => r.text !== action.payload!.text);
        case ACTIONS.COMPLETE_TODO:
            return todo.map((t) => t.text === action.payload!.text? {...t, completed:!t.completed } : t)
        case ACTIONS.ALL_TODOS:
            return todo
        case ACTIONS.ACTIVE_TODOS:
            // return todo.map((a) => a.text === action.payload!.text ? {...a, action.payload.text} : a)
            return todo.filter(a => a.completed === false)
        case ACTIONS.COMPLETED_TODOS:
            return todo.filter((c) => c.completed !== false)
        case ACTIONS.CLEAR_COMPLETED_TODOS:
            return todo.filter(c => c.completed === false)
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

    const completeTodo = (text: string) => {
        dispatch({type: ACTIONS.COMPLETE_TODO, payload: {text}})
    }

    const allTodo = () => {
        dispatch({type: ACTIONS.ALL_TODOS})
    }

    const activeTodos = () => {
        dispatch({type: ACTIONS.ACTIVE_TODOS})
    }

    const completedTodos = () => {
        dispatch({type: ACTIONS.COMPLETED_TODOS})
    }

    const clearCompletedTodos = () => {
        dispatch({type: ACTIONS.CLEAR_COMPLETED_TODOS})
    }

    return (
        <TodoContext.Provider value={{todo, addTodo, removeTodo, completeTodo, allTodo, activeTodos, completedTodos, clearCompletedTodos, light, setLight, newTodo, setNewTodo}}>
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