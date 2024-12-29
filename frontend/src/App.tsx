// import { useState } from 'react'
// import banner_dark from './assets/bg-desktop-dark.jpg';
// import banner_light from './assets/bg-desktop-light.jpg';
import dark_theme from './assets/icon-moon.svg'
import light_theme from './assets/icon-sun.svg'
import remove_icon from './assets/icon-cross.svg'
import './App.css'
import { useTodo } from './context/todo'
import { useEffect, useState } from 'react'

interface Todos {
  _id?: string,
  text?: string,
  completed?: boolean,
}

// interface TodoState {
//   newTodo: string,
//   setNewTodo: React.Dispatch<React.SetStateAction<undefined>>
// }

const App: React.FC = () => {
  const [todo, setTodo] = useState<Todos[]>([]);
  const { addTodo, removeTodo, completeTodo, allTodo, activeTodos, completedTodos, light, setLight, newTodo, setNewTodo } = useTodo();

  useEffect(() => {
    const getTodo = async() => {
      const res = await fetch(import.meta.env.VITE_API_URL)
      const data = await res.json();
      console.log(data)
      setTodo(data);
    }
    getTodo();
  }, [addTodo])

  return (
    <main id={`${!light ? 'main_dark' : 'main_light'}`}>
      <section className={`${!light ? 'banner_dark' : 'banner_light'}`}></section>

      <section>
        <div id='area'>
          <div className='header'>
            <p>TODO</p>
            <img src={light ? dark_theme : light_theme} alt="theme" onClick={() => setLight(!light)} />
          </div>

          <div className='input' style={!light ? {backgroundColor: 'hsl(235, 24%, 19%)'} : {backgroundColor: 'white'}}>
            <input type="checkbox" name="" id="" />
            <input type="text" placeholder='Create a new todo...' style={!light ? {color: 'white'} : {color: 'black'}} value={newTodo} onChange={(e) => setNewTodo(e.target.value)} onKeyDown={(e) => addTodo(e)} />
          </div>

          <div className={`${todo.length === 0 ? 'hidden' : 'todoList'}`} style={!light ? {backgroundColor: 'hsl(235, 24%, 19%)'} : {backgroundColor: 'hsl(0, 0%, 98%)'}}>
            {
              todo.map((t) => (
                <div key={t._id} className='todo' onClick={() => completeTodo(t.text!)}>
                  <div>
                    <input type="radio" name="todo" id="" value={t.text} />
                    <p>{t.text}</p>
                  </div>
                  <img src={remove_icon} alt="remove icon" width={10} onClick={() => removeTodo(t._id!)} />
                </div>
              ))
            }
            
            <div className='base' style={!light? {backgroundColor: 'hsl(235, 24%, 19%)'} : {backgroundColor: 'hsl(0, 0%, 98%)'}}>
              <p>{todo.length} items left</p>
              <div className='filter'>
                <p onClick={() => allTodo()}>All</p>
                <p onClick={() => activeTodos()}>Active</p>
                <p onClick={() => completedTodos()}>Completed</p>
              </div>
              <p>Clear Completed</p>
            </div>
          </div>

          <div></div>
        </div>
      </section>
    </main>
  )
}

export default App
