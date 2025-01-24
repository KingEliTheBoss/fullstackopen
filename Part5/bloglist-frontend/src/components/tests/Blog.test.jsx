import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach } from "vitest";
import Blog from "../Blog";

describe("<Blog />", () => {
    let container;
    const mockLikeHandler = vi.fn();
    const mockDeleteHandler = vi.fn();

    beforeEach(() => {
        const blog = {
            title: "testTitle",
            author: "testAuthor",
            likes: 69,
            url: "testUrl",
            id: "678d360386d29baec62d695b",
            user: {
                id: "678d327e0df12ab1f7d50c4f",
                username: "KingEliTheBoss",
                name: "Eli Sal"
            }
        };

        const user = {
            username: "KingEliTheBoss"
        };

        container = render(<Blog blog={blog} user={user}
            updateBlog={mockLikeHandler} deleteBlog={mockDeleteHandler} />).container;
    });

    test("renders title and author, but no url or likes by default", () => {
        const div1 = container.querySelector("#basicInfo");
        expect(div1).not.toHaveStyle("display: none");
        expect(div1).toHaveTextContent("testTitle testAuthor");

        const div2 = container.querySelector("#allInfo");
        expect(div2).toHaveStyle("display: none");
    });

    test("renders likes and url when show button is pressed", async () => {
        const user = userEvent.setup();
        const button = screen.getByText("show");
        await user.click(button);

        const div1 = container.querySelector("#allInfo");
        expect(div1).not.toHaveStyle("display: none");
        expect(div1).toHaveTextContent("69");
        expect(div1).toHaveTextContent("testUrl");

        const div2 = container.querySelector("#basicInfo");
        expect(div2).toHaveStyle("display: none");
    });

    test("event handler is called twice if button is pressed twice", async () => {
        const user = userEvent.setup();
        //const showButton = screen.getByText("show");
        //await user.click(showButton);

        const button = container.querySelector(".likeButton");
        await user.click(button);
        await user.click(button);

        expect(mockLikeHandler.mock.calls).toHaveLength(2);
    });

    test("delete event handler is called", async ()=>{
        //THIS SIMULATES PRESSING ON A CONFIRM WINDOW
        const confirmMock = vi.fn().mockReturnValue(true);
        global.confirm = confirmMock;

        const user = userEvent.setup();
        const button = container.querySelector("#removeButton");
        await user.click(button);

        window.confirm();

        expect(mockDeleteHandler.mock.calls).toHaveLength(1);
    });
});