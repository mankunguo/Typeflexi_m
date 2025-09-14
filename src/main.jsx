import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers'

const store = createStore(rootReducer)

ReactDOM.createRoot(document.getElementById('root')).render(
  //严格模式 // <App />
  // <React.StrictMode> 
      <Provider store={store}>
      <App />
    </Provider>
  // </React.StrictMode>,
      
)
