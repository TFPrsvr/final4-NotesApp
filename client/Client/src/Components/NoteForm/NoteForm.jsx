import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { AnimatedText } from '../../components/magicui/animated-text';
import { GradientText } from '../../components/magicui/gradient-text';
import { FloatingElements } from '../../components/magicui/floating-elements';
import { useUser } from '../../context/UserContext';

const COLOR_SWATCHES = [
  '#ffd54f',
  '#a5d6a7',
  '#90caf9',
  '#f48fb1',
  '#ce93d8',
  '#ffcc80',
  '#80deea',
  '#ef9a9a'
];

const NoteForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const { user, preferences } = useUser();
  const [color, setColor] = useState(preferences?.defaultNoteColor || '#ffd54f');
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      nav('/login2');
      return;
    }

    axios({
      method: 'get',
      url: `${import.meta.env.VITE_API_URL}/api/getUser`,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {})
      .catch(() => {
        nav('/login2');
      });
  }, [nav]);

  useEffect(() => {
    if (preferences?.defaultNoteColor) {
      setColor(preferences.defaultNoteColor);
    }
  }, [preferences]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim() || !content.trim()) {
      setFormError('Title and content are required.');
      return;
    }

    const token = localStorage.getItem('userToken');
    setSubmitting(true);

    axios({
      method: 'post',
      url: `${import.meta.env.VITE_API_URL}/api/createNote`,
      data: { title, content, color },
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        setTitle('');
        setContent('');
        nav('/get');
      })
      .catch(error => {
        console.error('Error creating note:', error.message);
        setFormError(error.response?.data?.error || 'Failed to create note. Please try again.');
        setSubmitting(false);
      });
  };

  return (
    <FloatingElements className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 to-slate-800">
      <Card
        className="w-full max-w-xl mx-auto backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 border-0 shadow-2xl"
        role="main"
        aria-label="Create new note form"
      >
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold mb-2">
            <GradientText from="from-yellow-500" via="via-orange-500" to="to-amber-600">
              <AnimatedText text="Create a Note" animation="slideUp" />
            </GradientText>
          </CardTitle>
          {user && (
            <p className="text-slate-600 dark:text-slate-400 text-base mt-1">
              Welcome, <span className="font-semibold">{user.username}</span>
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-5">
          {formError && (
            <div
              role="alert"
              aria-live="assertive"
              className="p-3 rounded-md bg-red-600 text-white text-sm font-medium"
            >
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <label
                htmlFor="note-title"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Note Title <span aria-hidden="true">*</span>
              </label>
              <Input
                id="note-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What do you want to call this note?"
                className="h-12 text-base px-4 bg-gray-100 border-gray-300 focus:bg-white transition-all duration-200"
                aria-label="Note title"
                aria-required="true"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="note-content"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Note Content <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="note-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What do you want to go here?"
                rows={5}
                className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-base text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 resize-y"
                aria-label="Note content"
                aria-required="true"
                required
              />
            </div>

            <div className="space-y-2">
              <p
                id="color-label"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Note Color
              </p>
              <div
                className="flex gap-3 flex-wrap"
                role="group"
                aria-labelledby="color-label"
              >
                {COLOR_SWATCHES.map(swatch => (
                  <button
                    key={swatch}
                    type="button"
                    onClick={() => setColor(swatch)}
                    aria-label={`Select note color ${swatch}`}
                    aria-pressed={color === swatch}
                    style={{ backgroundColor: swatch }}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
                      color === swatch
                        ? 'border-slate-800 ring-2 ring-slate-800 ring-offset-1 scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              aria-label="Submit and create note"
              className="h-12 text-base font-semibold bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ maxWidth: '16vw', minWidth: '140px', borderRadius: '12%' }}
            >
              {submitting ? 'Saving...' : 'Add Note'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </FloatingElements>
  );
};

export default NoteForm;
