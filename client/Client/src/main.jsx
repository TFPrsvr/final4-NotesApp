import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Login2 from './Components/Login/Login2.jsx';
import { ToastProvider } from './components/ui/toast.jsx';
import { UserProvider } from './context/UserContext.jsx';
import Reg from './Components/Reg/Reg.jsx';
import NoteForm from './Components/NoteForm/NoteForm.jsx';
import GetNotes from './Components/GetNotes/GetNotes.jsx';
import Dashboard from './Components/Nav/Dashboard.jsx';
import Settings from './Components/Settings/Settings.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<App />} />
            <Route path='/reg' element={<Reg />} />
            <Route path='/login2' element={<Login2 />} />
            <Route path='/notes' element={<NoteForm />} />
            <Route path='/get' element={<GetNotes />} />
            <Route path='/dash' element={<Dashboard />} />
            <Route path='/settings' element={<Settings />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </UserProvider>
  </StrictMode>,
);
