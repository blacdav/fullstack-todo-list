import React, { createContext, ReactNode, useContext, useReducer, useState } from "react";

interface TodoContextType {
    todo: Todos[],
    addTodo: (text: string) => void,
    // toggleTodo: (id: number) => void,
    // removeTodo: (id: number) => void,
    // completeAllTodos: () => void,
    // clearCompletedTodos: () => void,
    light: boolean,
    setLight:  React.Dispatch<React.SetStateAction<boolean>>
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

const ACTIONS ={
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
        default:
            return todo;
    }
}

const todoState: Todos[] = []

export const TodoProvider: React.FC<Children> = ({ children }) => {
    const [todo, dispatch] = useReducer(todoAction, todoState);
    const [light, setLight] = useState<boolean>(false)

    const addTodo = (text: string) => {
        dispatch({type: ACTIONS.ADD_TODO, payload: { text }})
    }

    return (
        <TodoContext.Provider value={{todo, addTodo, light, setLight}}>
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