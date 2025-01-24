import { render, screen } from "@testing-library/react";
import NoteForm from "./noteForm";
import userEvent from "@testing-library/user-event";

test("<NoteForm />", async () => {
    const createNote = vi.fn();
    const user = userEvent.setup();

    const { container } = render(<NoteForm createNote={createNote} />);

    //const input = screen.getByRole("textbox");
    const input = screen.getByPlaceholderText("write note content here");
    //const input = container.querySelector("#note-input");
    const sendButton = screen.getByText("save");

    await user.type(input, "testing a form...");
    await user.click(sendButton);

    expect(createNote.mock.calls).toHaveLength(1);
    expect(createNote.mock.calls[0][0].content).toBe("testing a form...");
});