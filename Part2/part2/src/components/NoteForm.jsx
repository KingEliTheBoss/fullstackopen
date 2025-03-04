import { useState } from "react";

const NoteForm = ({ createNote }) => {
    const [newNote, setNewNote] = useState();

    const addNote = (event) => {
        event.preventDefault();
        createNote({
            content: newNote,
            important: true
        });

        setNewNote("");
    };

    return (
        <div>
            <h2>Create a new note</h2>

            <form onSubmit={addNote}>
                <input value={newNote} placeholder="write note content here"
                    onChange={event => setNewNote(event.target.value)}
                    id="note-input" data-testid="newNoteInput" />
                <button type="submit">save</button>
            </form>
        </div>
    );
};

export default NoteForm;