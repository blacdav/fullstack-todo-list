// import { useState } from 'react'
// import banner_dark from './assets/bg-desktop-dark.jpg';
// import banner_light from './assets/bg-desktop-light.jpg';
import dark_theme from './assets/icon-moon.svg'
// import light_theme from './assets/icon-sun.svg'
import remove_icon from './assets/icon-cross.svg'
import './App.css'
import { useTodo } from './context/todo'

// interface Todos {
//   id?: number,
//   text?: string,
//   completed?: boolean,
// }

// interface TodoState {
//   newTodo: string,
//   setNewTodo: React.Dispatch<React.SetStateAction<undefined>>
// }

const App: React.FC = () => {
  const { todo, addTodo, removeTodo, setLight, newTodo, setNewTodo } = useTodo();

  return (
    <main>
      <section className='banner'></section>

      <section>
        <div id='area'>
          <div className='header'>
            <p>TODO</p>
            <img src={dark_theme} alt="theme" onClick={() => setLight(true)} />
          </div>

          <div className='input'>
            <input type="checkbox" name="" id="" />
            <input type="text" placeholder='Create a new todo...' value={newTodo} onChange={(e) => setNewTodo(e.target.value)} onKeyDown={(e) => addTodo(e)} />
          </div>

          <div id='todoList'>
            {
              todo.map((t) => (
                <div key={t.text} className='todo'>
                  <div>
                    <input type="radio" name="todo" id="" value={t.text} />
                    <p>{t.text}</p>
                  </div>
                  <img src={remove_icon} alt="remove icon" width={10} onClick={() => removeTodo(t.text!)} />
                </div>
              ))
            }
            
            <div className='base'>
              <p>5 items left</p>
              <div className='filter'>
                <p>All</p>
                <p>Active</p>
                <p>Completed</p>
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
