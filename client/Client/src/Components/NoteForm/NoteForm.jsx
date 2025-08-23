import React, { useState, useEffect } from "react";
import "./NoteForm.css";
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
// import { v4 as uuidv4 } from "uuid";
import GetNotes from "../GetNotes/GetNotes";

const NoteForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState({});
  const [user, setUser] = useState(null)

  const nav = useNavigate()

  useEffect(() => {
    if (nav) {
      const token = localStorage.getItem('authToken')
      
      axios({
        method: 'get',
        url: "http://localhost:3002/api/getUser", 
        headers: {
          'Authorization': `Bearer ${token}`, 
        },
        withCredentials: true,
      })
      .then((res) => {
        console.log('getUser res', res.data)
        setUser(res.data)
      })
      .catch((error) => {
        console.log('getUser err', error)
        nav('/login2')
      })
    }
  }, [])
  


  const userId = user && user._id ? user._id : null

const newNote = {
  // id: uuidv4(),
  title: title,
  content: content,
  User: userId,
};
  
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!userId) {
      console.error('User ID is required')
      return;
    }

    console.log('user submit hit:', userId)
    
    console.log("sub hit!", e.target.value, title, content);
    
    console.log("newNote", newNote);
    
    axios({
      method: "POST",
      url: "http://localhost:3002/api/createNote",
      data: newNote,
      withCredentials: true,
    })
    .then((res) => {
      console.log("createNote res", res.data);
      setNotes(res.data);
      setTitle("");
      setContent("");
    })
    .catch((error) => {
      console.log("createNote err", error);
    });
  };
  

  return (
    <div id="formComp">
      {console.log("notes:", notes)}
      {console.log("newNote:", newNote)}
      {console.log('user:', userId)}
      {user && <div>Welcome, {user.username}!</div>}

      <form onSubmit={handleSubmit}>

        <div id="notesData">

        <h1>📒 Let's Make Some Notes 📒</h1>

          <br />
          <br />

          <label htmlFor="formTitle" id="formTitle" className="labelForm">
            📝 Note Title: 📝
          </label>

          <br />
          <br />

          <textarea
            id="formTitle"
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you want to call this note?"
            required />

        </div>

        {/* <br /> */}
        {/* <br /> */}
        <br />

        <div>

          <label htmlFor="formContent" id="formContent" className="labelForm">
            ✍🏻 Note Contents:  ✍🏻
          </label>

          <br />
          <br />

          <textarea
            id="formContent"
            type="text"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you want to go here?"
            required />

        </div>

        {/* <br /> */}
        {/* <br /> */}
        {/* <br /> */}
        {/* <br /> */}
        <br />
        <br />

        <button id="submitBtn" type="submit">
        📝  Add This Note 📝
        </button>

      </form>

      {/* <br /> */}
      {/* <br /> */}
      {/* <br /> */}
      <br />
      <br />

      <br />



      <div id="getNotesDiv">
        {/* <GetNotes
          title={title}
          notes={notes}
          setNotes={setNotes}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          newNote={newNote}  
          /> */}
          <br />

          <p>
          😒 No Notes Yet 😒 </p>
          <br />
          <Link to="/get" id='fetch'>&nbsp;😁 Get My Notes! 😁</Link>

      </div>
    </div>
  );
};

export default NoteForm;
