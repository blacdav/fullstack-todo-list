import React, { createContext, ReactNode, useCallback, useContext, useEffect, useReducer, useState } from "react";

interface TodoContextType {
    todo: Todos[],
    addTodo: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    completeTodo: (_id: string) => void,
    removeTodo: (_id: string) => void,
    allTodo: () => void,
    activeTodos: () => void,
    completedTodos: () => void,
    clearCompletedTodos: () => void,
    light: boolean,
    setLight:  React.Dispatch<React.SetStateAction<boolean>>,
    newTodo: string,
    setNewTodo: React.Dispatch<React.SetStateAction<string>>,
}

interface Children {
    children: ReactNode
}

interface Todos {
    _id?: string,
    text?: string,
    completed?: boolean,
}

interface Actions {
    type: string,
    payload?: Todos[] | Todos,
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const ACTIONS = {
    FETCH_TODOS: 'FETCH_TODOS',
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
        case ACTIONS.FETCH_TODOS:
            return Array.isArray(action.payload) ? action.payload : [];
        case ACTIONS.ADD_TODO:
            return [...todo, action.payload! as Todos]
        case ACTIONS.REMOVE_TODO:
            return todo.filter((r) => r._id !== (action.payload! as Todos)._id);
        case ACTIONS.COMPLETE_TODO:
            return todo.map((c) => c._id == (action.payload! as Todos)._id ? {...c, completed:!c.completed } : c)
            // return todo.map((t) => t.text === (action.payload! as Todos).text ? {...t, completed: !t.completed } : t)
        case ACTIONS.ALL_TODOS:
            // return [...todo]
            return todo.filter(a => a._id)
        case ACTIONS.ACTIVE_TODOS:
            // return todo.map((a) => a.text === action.payload!.text ? {...a, action.payload.text} : a)
            return todo.filter(a => a.completed === false)
        case ACTIONS.COMPLETED_TODOS:
            return todo.filter((c) => c.completed === true)
        //     // return todo.some((c) => c.completed === true);
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

    const addTodo = useCallback(
        async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (newTodo.trim() === '') {
            return;
        } else if (e.key === 'Enter') {
            try {
                const res = await fetch(import.meta.env.VITE_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: newTodo, completed: false }),
                });
                if (!res.ok) {
                    throw new Error("Failed to add todo to the database");
                }
                const data = await res.json();
                dispatch({ type: ACTIONS.ADD_TODO, payload: data });
            } catch (error) {
                console.error(error);
            }
            setNewTodo('');
        }
    }, [newTodo])

    const removeTodo = useCallback(
        async (_id: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/${_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if (!res.ok) {
                throw new Error("Failed to remove todo from the database");
            }
            dispatch({type: ACTIONS.REMOVE_TODO, payload: { _id }})
        } catch (error) {
            console.log(error)
        }
    }, [])

    const completeTodo = (_id: string): void => {
        dispatch({type: ACTIONS.COMPLETE_TODO, payload: { _id }})
    }

    const allTodo = () => {
        dispatch({type: ACTIONS.ALL_TODOS})
    }

    const activeTodos = () => {
        dispatch({type: ACTIONS.ACTIVE_TODOS})
    }

    const completedTodos = () => {
        dispatch({type: ACTIONS.COMPLETED_TODOS})
        // return todo.some((c) => c.completed === true)
    }

    const clearCompletedTodos = () => {
        dispatch({type: ACTIONS.CLEAR_COMPLETED_TODOS})
    }

    useEffect(() => {
        try {
            const getTodo = async () => {
                const res = await fetch(import.meta.env.VITE_API_URL)
                const data = await res.json();
                console.log(data)
                //   setTodos(data);
                dispatch({type: ACTIONS.FETCH_TODOS, payload: data})
            }
            getTodo();
        } catch (error) {
            console.error(error)
        }
      }, [addTodo, removeTodo])

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