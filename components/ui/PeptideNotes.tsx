'use client';

import { useState } from 'react';
import { Card } from './card';
import { Button } from './button';
import { Textarea } from './textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

interface Note {
  id: string;
  note_type: string;
  note_text: string;
  note_date: string;
  created_at: string;
}

interface PeptideNotesProps {
  peptideName: string;
  notes: Note[];
  onAddNote: (note: { note_type: string; note_text: string }) => Promise<void>;
  onDeleteNote?: (noteId: string) => Promise<void>;
}

export function PeptideNotes({ peptideName, notes, onAddNote, onDeleteNote }: PeptideNotesProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [noteType, setNoteType] = useState('observation');
  const [noteText, setNoteText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onAddNote({ note_type: noteType, note_text: noteText });
      setNoteText('');
      setNoteType('observation');
      setIsAdding(false);
    } catch (error) {
      alert('Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  const getNoteTypeColor = (type: string) => {
    switch (type) {
      case 'effect':
        return 'bg-[var(--ok)]/10 text-[var(--ok)] border-[var(--ok)]/20';
      case 'side_effect':
        return 'bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20';
      case 'progress':
        return 'bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20';
      case 'observation':
        return 'bg-[var(--accent-2)]/10 text-[var(--accent-2)] border-[var(--accent-2)]/20';
      default:
        return 'bg-[var(--text-muted)]/10 text-[var(--text-muted)] border-[var(--text-muted)]/20';
    }
  };

  const getNoteTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--text)]">Notes for {peptideName}</h3>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            size="sm"
            className="bg-[var(--accent)] text-[#001018] hover:opacity-90 rounded-full px-4"
          >
            + Add Note
          </Button>
        )}
      </div>

      {/* Add Note Form */}
      {isAdding && (
        <Card className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select onValueChange={setNoteType} value={noteType}>
              <SelectTrigger className="bg-[var(--surface-1)] border-[var(--border)] text-[var(--text)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="observation">Observation</SelectItem>
                <SelectItem value="effect">Positive Effect</SelectItem>
                <SelectItem value="side_effect">Side Effect</SelectItem>
                <SelectItem value="progress">Progress Update</SelectItem>
                <SelectItem value="general">General Note</SelectItem>
              </SelectContent>
            </Select>

            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write your note..."
              rows={3}
              required
              className="bg-[var(--surface-1)] border-[var(--border)] text-[var(--text)]"
            />

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-[var(--accent)] text-[#001018] hover:opacity-90 rounded-full"
              >
                {isSaving ? 'Saving...' : 'Save Note'}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNoteText('');
                }}
                className="bg-[var(--surface-1)] border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-1)]/80 rounded-full"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Notes List */}
      <div className="space-y-3">
        {notes.length === 0 ? (
          <p className="text-sm text-[var(--text-dim)] text-center py-8">
            No notes yet for this peptide
          </p>
        ) : (
          notes.map((note) => (
            <Card key={note.id} className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="flex items-start justify-between mb-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getNoteTypeColor(note.note_type)}`}>
                  {getNoteTypeLabel(note.note_type)}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {new Date(note.note_date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-[var(--text-dim)] leading-relaxed">{note.note_text}</p>
              {onDeleteNote && (
                <button
                  onClick={() => onDeleteNote(note.id)}
                  className="text-xs text-[var(--danger)] hover:text-[var(--danger)]/80 mt-2"
                >
                  Delete
                </button>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

