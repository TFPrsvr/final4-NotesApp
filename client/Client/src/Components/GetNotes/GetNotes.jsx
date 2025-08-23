import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../GetNotes/GetNotes.css";


const GetNotes = ({
  title,
  setTitle,
  notes,
  setNotes,
  content,
  setContent,
  newNote,
}) => {
  const [allNotes, setAllNotes] = useState([]);
  const [error, setError] = useState(null);

  const [editingNote, setEditingNote] = useState(null);
  const [updatedData, setUpdatedData] = useState({ title: "", content: "" });




  const handleFetchNotes = () => {
    axios({
      method: "GET",
      url: "http://localhost:3002/api/note/get",
      // withCredentials: true,
    })
      .then((res) => {
        console.log("getNotes res", res.data);
        setAllNotes(res.data.allNotes);
      })
      .catch((error) => {
        console.log("getNotes error", error.response ||error.message);
      });
  };



  // useEffect(() => {
  //   if (title || content) {
  //     handleFetchNotes();
  //   }
  // }, [title, content]);



  const updateNote = (noteId, updatedData) => {
    
    console.log("updatadData:", updatedData);

      axios({
      method: "put",
      url: `http://localhost:3002/api/update/note/${noteId}`,
      data: updatedData,
      withCredentials: true,
    })
      .then((res) => {
        console.log("update res", res.data);
        setAllNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === noteId ? { ...note, ...updatedData } : note
          )
        );
        setEditingNote(null);
        handleFetchNotes(updatedData);
      })
      .catch((err) => console.log("update err", err.response || err.message));

    console.log("fetched updated notes", updatedData);
  };



  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };



  // const startEditing = (note) => {
  //   setEditingNote(note._id);
  //   setUpdatedData({ title: note.title, content: note.content });
  // };

  // Handle canceling edit
  // const handleCancelEdit = () => {
  //     setEditingNote(null);
  //     setUpdatedData({ title: '', content: '', tags: [] });
  // };



  const deleteNote = (noteId) => {
  
    console.log("del Hit!", noteId);

    axios({
      method: "DELETE",
      url: `http://localhost:3002/api/delete/note/${noteId}`,
      withCredentials: true,
    })
      .then((res) => {
        console.log("del res", res.data);
        // setNotes(notes.filter(note => note.id !== note.id))
        setAllNotes((prevNotes) =>
          prevNotes.filter((item) => item._id !== noteId)
        );
        handleFetchNotes();
      })
      .catch((err) => {
        console.log(" del err", err.response || err.message);
      });
  };

  
  
  const handleEditClick = (note) => {
    setEditingNote(note._id);
    setUpdatedData({
      title: note.title,
      content: note.content,
    });
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;
    const reorderedNotes = Array.from(allNotes);
    const [movedNote] = reorderedNotes.splice(source.index, 1);
    reorderedNotes.splice(destination.index, 0, movedNote);

    setAllNotes(reorderedNotes);
  };



  {
    /* {console.log('notes', notes)} */
  }
  {
    /* {console.log('allNotes', allNotes)} */
  }
  {
    /* {console.log('setAllNotes', setAllNotes)} */
  }
  {
    /* {console.log('newNote:', newNote)} */
  }
  {
    /* {console.log('title:')} */
  }
  {
    /* {console.log('content:')} */
  }


  return (
    //     <div id='cLogs'>
    // {console.log('updatedData:', updatedNote)}
    // {console.log('allNotes:'. allNotes)}
    // <console.log('notes:', notes)
    //     </div>

    <div id="getNotes">


{/* B4 you ask yes i got the dragDropContext stuff from ChatGPT */}


      {error && <div className="error-message">{error}</div>}

      {/* <br /> */}
      {/* <br /> */}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              id="notesArray"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {/* <br /> */}
              {/* <br /> */}

            {/* And yes i got the Array.isArray from ChatGPT */}
            <h1>📃 Notes 📃</h1>

              {Array.isArray(allNotes) && allNotes.length > 0 ? (
                allNotes.map((note, index) => (
                  <Draggable
                    key={note._id}
                    draggableId={note._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="note-card"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {editingNote === note._id ? (
                         
                         <div id="editing">
                            <br />

                            <input
                              type="text"
                              name="title"
                              value={updatedData.title}
                              placeholder="Update Name of Note"
                              onChange={handleChange}
                            />

                            <br />
                            <br />

                            <textarea
                              name="content"
                              value={updatedData.content}
                              placeholder="Update Note Information"
                              onChange={handleChange}
                            />

                            <br />
                            <br />

                            <div className="btns">


                            <button className="btnGrp1"
                              onClick={() => updateNote(note._id, updatedData)} >
                              Save Changes                       
                            </button>

                            <br />
                            <br />

                            <button className="btnGrp1" 
                            onClick={() => setEditingNote(null)}>
                              Cancel
                            </button>

                              </div>
                            <br />
                            <br />

                            <div>

                            <button className="btnGrp2"
                              onClick={() => handleFetchNotes()}
                              id="editFetchBtn">

                             🗒️📃 All Notes Again 😒🙄 
                            </button>



                            </div>


                          </div>

                        ) : (

                          <div className="note-content">
                           
                           <br />
                            <h3 id="titleDisplayed"> {note.title}</h3>

                            <br />

                            <p id="contentDisplayed">{note.content}</p>

                         <div className="btn-group">
                              <br />
                              <br />

                              <button
                                id="editClick"
                                onClick={() => handleEditClick(note)} >
                                Edit
                              </button>

                              <br />
                              <br />

                              <button
                                id="delNote"
                                onClick={() => deleteNote(note._id)}>
                                Delete Note
                              </button>

                         </div>
                              
                              <br />
                              <br />

                              {/* <button 
                                id="editFetch"
                                onClick={() => handleFetchNotes()}>
                                My Notes
                              </button> */}

                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))
              )
               : 
              (
                <div id="noNotesAvail">
                  <br />
                  <br />

                  {/* <p>😒 No Notes Yet 😒 </p> */}
                  <br />

                  <button onClick={() => handleFetchNotes()} id="fetch">
                    Go Fetch My Notes! 😁{" "}
                  </button>
                
                </div>

                )
               }
              {provided.placeholder}
            </div>
          )}

          
        </Droppable>
      </DragDropContext>

     </div>
  );
};

export default GetNotes;
