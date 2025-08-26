import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './Components/Login/Login.jsx'
import Login2 from './Components/Login/Login2.jsx'
import { ToastProvider } from './components/ui/toast.jsx'
import { UserProvider } from './context/UserContext.jsx'
import Reg from './Components/Reg/Reg.jsx'
import NoteForm from './Components/NoteForm/NoteForm.jsx'
import Nav from'./Components/Nav/Nav.jsx'
import GetNotes from './Components/GetNotes/GetNotes.jsx'
import Dashboard from './Components/Nav/Dashboard.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={< App/>} />
            <Route path='/nav' element={<Nav />} />
            <Route path='/reg' element={<Reg />} />
            <Route path='/login' element={<Login />} />
            <Route path='/login2' element={<Login2 />} />
            <Route path='/notes' element={<NoteForm />} />
            <Route path='/get' element={<GetNotes />} />
            <Route path='/dash' element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </UserProvider>
  </StrictMode>,
)
