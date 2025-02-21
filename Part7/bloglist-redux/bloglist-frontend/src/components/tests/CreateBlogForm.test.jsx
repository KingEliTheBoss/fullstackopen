import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach } from "vitest";
import CreateBlogForm from "../CreateBlogForm";

describe("<CreateBlogForm />", () => {
    let container;
    const mockFunction = vi.fn();

    beforeEach(() => {
        container = render(<CreateBlogForm createBlog={mockFunction} />).container;
    });

    test("form calls event handler with right details", async () => {
        //screen.getByRole("button", {name: "formCreateBlog"});
        const submitButton = container.querySelector("#submitButton");
        const titleInput = container.querySelector("#titleInput");
        const authorInput = container.querySelector("#authorInput");
        const urlInput = container.querySelector("#urlInput");

        const user = userEvent.setup();
        await user.type(titleInput, "testing title...");
        await user.type(authorInput, "testing author...");
        await user.type(urlInput, "testing url...");
        await user.click(submitButton);

        expect(mockFunction.mock.calls).toHaveLength(1);

        expect(mockFunction.mock.calls[0][0].title).toBe("testing title...");
        expect(mockFunction.mock.calls[0][0].author).toBe("testing author...");
        expect(mockFunction.mock.calls[0][0].url).toBe("testing url...");
        /*expect(mockFunction.mock.calls[0][0]).toStrictEqual({
            title: "testing title...", 
            author: "testing author...",
            url: "testing url..."
        });*/
    });
});