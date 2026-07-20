import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { AnimatedText } from '../../components/magicui/animated-text';
import { GradientText } from '../../components/magicui/gradient-text';
import { FloatingElements } from '../../components/magicui/floating-elements';
import { useUser } from '../../context/UserContext';
import { useToast } from '../../components/ui/toast';

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

const FONT_OPTIONS = [
  'Arial',
  'Georgia',
  'Courier New',
  'Verdana',
  'Trebuchet MS'
];

const Settings = () => {
  const nav = useNavigate();
  const { preferences, updatePreferences, isAuthenticated, loading: userLoading } = useUser();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [localPrefs, setLocalPrefs] = useState({
    defaultNoteColor: preferences?.defaultNoteColor || '#ffd54f',
    font: preferences?.font || 'Arial',
    layout: preferences?.layout || 'grid'
  });

  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      nav('/login2');
    }
  }, [isAuthenticated, userLoading, nav]);

  useEffect(() => {
    if (preferences) {
      setLocalPrefs({
        defaultNoteColor: preferences.defaultNoteColor || '#ffd54f',
        font: preferences.font || 'Arial',
        layout: preferences.layout || 'grid'
      });
    }
  }, [preferences]);

  const handleSave = () => {
    setSaving(true);

    updatePreferences(localPrefs)
      .then(() => {
        toast.success('Settings saved successfully!');
        setSaving(false);
      })
      .catch(() => {
        toast.error('Failed to save settings. Please try again.');
        setSaving(false);
      });
  };

  if (userLoading) {
    return (
      <FloatingElements className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <p className="text-slate-300 text-lg">Loading settings...</p>
      </FloatingElements>
    );
  }

  return (
    <FloatingElements className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <main id="main-content" className="max-w-2xl mx-auto space-y-6">
        <header className="flex items-center gap-4">
          <Button
            onClick={() => nav('/dash')}
            variant="outline"
            aria-label="Go back to dashboard"
            className="border-slate-400 text-slate-200 hover:bg-slate-700 h-10"
            style={{ maxWidth: '16vw', minWidth: '90px', borderRadius: '12%' }}
          >
            &larr; Back
          </Button>
          <h1 className="text-3xl font-bold">
            <GradientText from="from-purple-400" via="via-blue-400" to="to-indigo-400">
              <AnimatedText text="Settings" animation="slideUp" />
            </GradientText>
          </h1>
        </header>

        <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100">
              <AnimatedText text="Note Preferences" animation="scaleIn" />
            </CardTitle>
            <CardDescription>
              Customize the default behavior for your notes.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Default Note Color */}
            <section aria-labelledby="color-section-label">
              <h2
                id="color-section-label"
                className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-3"
              >
                Default Note Color
              </h2>
              <div
                className="flex gap-3 flex-wrap"
                role="group"
                aria-labelledby="color-section-label"
              >
                {COLOR_SWATCHES.map(swatch => (
                  <button
                    key={swatch}
                    type="button"
                    onClick={() => setLocalPrefs(p => ({ ...p, defaultNoteColor: swatch }))}
                    aria-label={`Set default note color to ${swatch}`}
                    aria-pressed={localPrefs.defaultNoteColor === swatch}
                    style={{ backgroundColor: swatch }}
                    className={`w-9 h-9 rounded-full border-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                      localPrefs.defaultNoteColor === swatch
                        ? 'border-slate-800 ring-2 ring-slate-800 ring-offset-1 scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </section>

            {/* Font */}
            <section aria-labelledby="font-section-label">
              <h2
                id="font-section-label"
                className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-3"
              >
                Note Font
              </h2>
              <div
                className="flex flex-col gap-2"
                role="radiogroup"
                aria-labelledby="font-section-label"
              >
                {FONT_OPTIONS.map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setLocalPrefs(p => ({ ...p, font: f }))}
                    aria-label={`Select font: ${f}`}
                    aria-pressed={localPrefs.font === f}
                    style={{ fontFamily: f }}
                    className={`text-left px-4 py-3 rounded-lg border-2 text-base transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-purple-500 ${
                      localPrefs.font === f
                        ? 'border-purple-600 bg-purple-50 text-purple-900 font-semibold'
                        : 'border-gray-200 bg-gray-50 text-slate-700 hover:border-purple-300 hover:bg-purple-50/40'
                    }`}
                  >
                    <span className="block text-xs font-sans text-slate-400 mb-0.5 font-normal">{f}</span>
                    The quick brown fox jumps over the lazy dog
                  </button>
                ))}
              </div>
            </section>

            {/* Layout */}
            <section aria-labelledby="layout-section-label">
              <h2
                id="layout-section-label"
                className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-3"
              >
                Notes Layout
              </h2>
              <div
                className="flex gap-3"
                role="group"
                aria-labelledby="layout-section-label"
              >
                <Button
                  type="button"
                  onClick={() => setLocalPrefs(p => ({ ...p, layout: 'grid' }))}
                  aria-label="Switch to grid layout"
                  aria-pressed={localPrefs.layout === 'grid'}
                  className={`h-11 font-medium transition-all ${
                    localPrefs.layout === 'grid'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-gray-200 text-slate-700 hover:bg-gray-300'
                  }`}
                  style={{ maxWidth: '16vw', minWidth: '90px', borderRadius: '12%' }}
                >
                  Grid
                </Button>
                <Button
                  type="button"
                  onClick={() => setLocalPrefs(p => ({ ...p, layout: 'list' }))}
                  aria-label="Switch to list layout"
                  aria-pressed={localPrefs.layout === 'list'}
                  className={`h-11 font-medium transition-all ${
                    localPrefs.layout === 'list'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-gray-200 text-slate-700 hover:bg-gray-300'
                  }`}
                  style={{ maxWidth: '16vw', minWidth: '90px', borderRadius: '12%' }}
                >
                  List
                </Button>
              </div>
            </section>

            {/* Save Button */}
            <div className="pt-2">
              <Button
                type="button"
                onClick={handleSave}
                disabled={saving}
                aria-label="Save your preference settings"
                className="h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ maxWidth: '16vw', minWidth: '150px', borderRadius: '12%' }}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </FloatingElements>
  );
};

export default Settings;
