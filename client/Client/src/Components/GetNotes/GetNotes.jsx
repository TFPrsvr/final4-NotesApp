import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from '../../components/ui/button';
import { FloatingElements } from '../../components/magicui/floating-elements';
import { GradientText } from '../../components/magicui/gradient-text';
import { AnimatedText } from '../../components/magicui/animated-text';
import { useUser } from '../../context/UserContext';
import '../GetNotes/GetNotes.css';

const GetNotes = () => {
  const [allNotes, setAllNotes] = useState([]);
  const [error, setError] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [updatedData, setUpdatedData] = useState({ title: '', content: '' });
  const [loadingNotes, setLoadingNotes] = useState(true);
  const nav = useNavigate();
  const { preferences } = useUser();

  const layout = preferences?.layout || 'list';
  const font = preferences?.font || 'Arial';
  const isGrid = layout === 'grid';

  const getToken = () => localStorage.getItem('userToken');

  const sortNotes = (notes) => {
    const pinned = notes.filter(n => n.pinned);
    const unpinned = notes.filter(n => !n.pinned);
    return [...pinned, ...unpinned];
  };

  const fetchNotes = () => {
    const token = getToken();
    if (!token) {
      nav('/login2');
      return;
    }

    setLoadingNotes(true);
    setError(null);

    axios({
      method: 'get',
      url: `${import.meta.env.VITE_API_URL}/api/note/get`,
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setAllNotes(sortNotes(res.data.allNotes || []));
        setLoadingNotes(false);
      })
      .catch(err => {
        console.error('Error fetching notes:', err.message);
        setError('Failed to load notes. Please try again.');
        setLoadingNotes(false);
      });
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (note) => {
    setEditingNote(note._id);
    setUpdatedData({ title: note.title, content: note.content });
  };

  const updateNote = (noteId, data) => {
    const token = getToken();

    axios({
      method: 'put',
      url: `${import.meta.env.VITE_API_URL}/api/update/note/${noteId}`,
      data,
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setAllNotes(prev =>
          sortNotes(prev.map(note =>
            note._id === noteId ? { ...note, ...data } : note
          ))
        );
        setEditingNote(null);
      })
      .catch(err => {
        console.error('Error updating note:', err.message);
        setError('Failed to update note.');
      });
  };

  const togglePin = (note) => {
    const token = getToken();

    axios({
      method: 'put',
      url: `${import.meta.env.VITE_API_URL}/api/update/note/${note._id}`,
      data: { pinned: !note.pinned },
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setAllNotes(prev =>
          sortNotes(prev.map(n =>
            n._id === note._id ? { ...n, pinned: !n.pinned } : n
          ))
        );
      })
      .catch(err => {
        console.error('Error toggling pin:', err.message);
        setError('Failed to update pin status.');
      });
  };

  const deleteNote = (noteId) => {
    const token = getToken();

    axios({
      method: 'delete',
      url: `${import.meta.env.VITE_API_URL}/api/delete/note/${noteId}`,
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        setAllNotes(prev => prev.filter(item => item._id !== noteId));
      })
      .catch(err => {
        console.error('Error deleting note:', err.message);
        setError('Failed to delete note.');
      });
  };

  const onDragEnd = (result) => {
    if (isGrid) return;

    const { destination, source } = result;
    if (!destination) return;

    const unpinned = allNotes.filter(n => !n.pinned);
    const pinned = allNotes.filter(n => n.pinned);

    const pinnedCount = pinned.length;
    const adjustedSource = source.index - pinnedCount;
    const adjustedDest = destination.index - pinnedCount;

    if (adjustedSource < 0 || adjustedDest < 0) return;

    const reordered = Array.from(unpinned);
    const [moved] = reordered.splice(adjustedSource, 1);
    reordered.splice(adjustedDest, 0, moved);

    setAllNotes([...pinned, ...reordered]);
  };

  return (
    <FloatingElements className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <main id="main-content" className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">
              <GradientText from="from-yellow-400" via="via-orange-400" to="to-amber-500">
                <AnimatedText text="My Notes" animation="slideUp" />
              </GradientText>
            </h1>
            <span
              aria-label={`Current layout: ${layout}`}
              title={`Layout: ${layout}`}
              className="text-slate-400 text-sm font-medium uppercase tracking-wide select-none"
            >
              {isGrid ? '⊞ Grid' : '☰ List'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/settings" aria-label="Change layout in settings">
              <Button
                variant="outline"
                aria-label="Go to settings to change layout"
                className="border-slate-500 text-slate-200 hover:bg-slate-700 h-10"
                style={{ maxWidth: '16vw', minWidth: '90px', borderRadius: '12%' }}
              >
                Layout
              </Button>
            </Link>
            <Link to="/notes">
              <Button
                aria-label="Create a new note"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold h-11"
                style={{ maxWidth: '16vw', minWidth: '120px', borderRadius: '12%' }}
              >
                + New Note
              </Button>
            </Link>
          </div>
        </header>

        {error && (
          <div role="alert" aria-live="assertive" className="p-3 rounded-md bg-red-600 text-white text-sm font-medium">
            {error}
          </div>
        )}

        {loadingNotes ? (
          <p className="text-slate-300 text-center py-12">Loading your notes...</p>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="notes-droppable">
              {(provided) => (
                <section
                  id="notes-array"
                  aria-label={isGrid ? 'Notes grid' : 'Notes list'}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={
                    isGrid
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                      : 'flex flex-col gap-4'
                  }
                >
                  {Array.isArray(allNotes) && allNotes.length > 0 ? (
                    allNotes.map((note, index) => (
                      <Draggable
                        key={note._id}
                        draggableId={note._id}
                        index={index}
                        isDragDisabled={isGrid || note.pinned}
                      >
                        {(provided) => (
                          <article
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            aria-label={`Note: ${note.title}`}
                            className="rounded-xl shadow-md p-5 relative"
                            style={{
                              backgroundColor: note.color || '#ffd54f',
                              color: '#1a1a1a',
                              fontFamily: font
                            }}
                          >
                            <button
                              onClick={() => togglePin(note)}
                              aria-label={note.pinned ? 'Unpin this note' : 'Pin this note'}
                              aria-pressed={note.pinned}
                              className="absolute top-3 right-3 text-xl bg-transparent border-none cursor-pointer opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-slate-700 rounded"
                            >
                              {note.pinned ? '📌' : '📍'}
                            </button>

                            {editingNote === note._id ? (
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  name="title"
                                  value={updatedData.title}
                                  onChange={handleChange}
                                  placeholder="Note title"
                                  aria-label="Edit note title"
                                  className="w-full rounded border border-slate-400 bg-white/80 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-600"
                                />
                                <textarea
                                  name="content"
                                  value={updatedData.content}
                                  onChange={handleChange}
                                  placeholder="Note content"
                                  rows={4}
                                  aria-label="Edit note content"
                                  className="w-full rounded border border-slate-400 bg-white/80 px-3 py-2 text-slate-800 resize-y focus:outline-none focus:ring-2 focus:ring-slate-600"
                                />
                                <div className="flex gap-3 flex-wrap">
                                  <Button
                                    onClick={() => updateNote(note._id, updatedData)}
                                    aria-label="Save changes to this note"
                                    className="bg-slate-800 text-white hover:bg-slate-700 h-10"
                                    style={{ maxWidth: '16vw', minWidth: '110px', borderRadius: '12%' }}
                                  >
                                    Save Changes
                                  </Button>
                                  <Button
                                    onClick={() => setEditingNote(null)}
                                    aria-label="Cancel editing this note"
                                    variant="outline"
                                    className="border-slate-700 text-slate-800 hover:bg-slate-100 h-10"
                                    style={{ maxWidth: '16vw', minWidth: '90px', borderRadius: '12%' }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <h2 className="text-xl font-bold mb-2 pr-8">{note.title}</h2>
                                <p className="text-base leading-relaxed mb-4">{note.content}</p>
                                <div className="flex gap-3 flex-wrap">
                                  <Button
                                    onClick={() => handleEditClick(note)}
                                    aria-label={`Edit note: ${note.title}`}
                                    className="bg-slate-800 text-white hover:bg-slate-700 h-10"
                                    style={{ maxWidth: '16vw', minWidth: '80px', borderRadius: '12%' }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    onClick={() => deleteNote(note._id)}
                                    aria-label={`Delete note: ${note.title}`}
                                    variant="outline"
                                    className="border-red-600 text-red-700 hover:bg-red-50 h-10"
                                    style={{ maxWidth: '16vw', minWidth: '90px', borderRadius: '12%' }}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            )}
                          </article>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <div className="text-center py-16 space-y-4">
                      <p className="text-slate-300 text-lg">No notes yet. Create your first note!</p>
                      <Link to="/notes">
                        <Button
                          aria-label="Create your first note"
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold h-11"
                          style={{ maxWidth: '16vw', minWidth: '140px', borderRadius: '12%' }}
                        >
                          Create Note
                        </Button>
                      </Link>
                    </div>
                  )}
                  {provided.placeholder}
                </section>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </main>
    </FloatingElements>
  );
};

export default GetNotes;
