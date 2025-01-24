const { test, describe, expect, beforeEach } = require("@playwright/test");
const { loginWith, createNote } = require("./helper");

describe("Note app", () => {
    beforeEach(async ({ page, request }) => {
        await request.post("/api/testing/reset");
        await request.post("/api/users", {
            data: {
                name: "Matti Luukkainen",
                username: "mluukkai",
                password: "salainen"
            }
        });

        await page.goto("/");
    });

    test("front page can be opened", async ({ page }) => {
        const locator = await page.getByText("Notes");
        await expect(locator).toBeVisible();
        await expect(page.getByText("Note app, Department of Computer Science, University of Helsinki 2024")).toBeVisible();
    });

    test("login form can be opened", async ({ page }) => {
        loginWith(page, "mluukkai", "salainen");
        await expect(page.getByText("Matti Luukkainen logged-in")).toBeVisible();
    });

    test("login fails with wrong password", async ({ page }) => {
        loginWith(page, "mluukkai", "wrong");

        const errorDiv = await page.locator(".error");
        await expect(errorDiv).toContainText("Wrong credentials");
        await expect(errorDiv).toHaveCSS("border-style", "solid");
        console.log(errorDiv);
        //await expect(errorDiv).toHaveCSS("color", 'rgb(255,0,0)');

        await expect(page.getByText("Matti Luukkainen logged-in")).not.toBeVisible();
    });

    describe("when logged in", () => {
        beforeEach(async ({ page }) => {
            loginWith(page, "mluukkai", "salainen");
        });

        test("a new note can be created", async ({ page }) => {
            await createNote(page, "a note created by playwright");
            await expect(page.getByText("a note created by playwright")).toBeVisible();
        });

        describe("and several notes exist", () => {
            beforeEach(async ({ page }) => {
                await createNote(page, "first note");
                await createNote(page, "second note");
                await createNote(page, "third note");
            });

            test("importance can be changed", async ({ page }) => {
                await page.pause();
                const otherNoteText = await page.getByText("second note");
                const otherNoteElement = await otherNoteText.locator("..");

                await otherNoteElement.getByRole("button", { name: "make not important" }).click();
                await expect(otherNoteElement.getByText("make important")).toBeVisible();
            });
        });
    });
});
