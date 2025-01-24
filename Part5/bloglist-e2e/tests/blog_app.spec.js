const { test, describe, expect, beforeEach } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");
const exp = require("constants");

describe("Blog app", () => {
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

    test("Login form is shown", async ({ page }) => {
        await expect(page.getByText("Log in to application")).toBeVisible();
        await expect(page.getByText("username")).toBeVisible();
        await expect(page.getByText("password")).toBeVisible();
        await expect(page.getByText("login")).toBeVisible();
    });

    describe("Login", () => {
        test("suceeds with correct credentials", async ({ page }) => {
            loginWith(page, "mluukkai", "salainen");
            await expect(page.getByText("Matti Luukkainen logged-in")).toBeVisible();
        });

        test("fails with wrong credentials", async ({ page }) => {
            loginWith(page, "mluukkai", "wrong");
            const errorDiv = await page.locator(".error");
            await expect(errorDiv).toContainText("Wrong credentials");
            await expect(page.getByText("Matti Luukkainen logged-in")).not.toBeVisible();
        });
    })

    describe("When logged in", () => {
        beforeEach(async ({ page }) => {
            loginWith(page, "mluukkai", "salainen");
        });

        test("a new blog can be created", async ({ page }) => {
            await createBlog(page, "E2E Tests", "Playwright", "https://playwright.dev");
            const basicInfo = await page.getByTestId("basicInfo");
            await expect(basicInfo.getByText("E2E Tests Playwright")).toBeVisible();
        });

        describe("and blogs exist", () => {
            beforeEach(async ({ page }) => {
                await createBlog(page, "First", "Playwright", "https://playwright.dev");
                await createBlog(page, "Second", "Playwright", "https://playwright.dev");
                await createBlog(page, "Third", "Playwright", "https://playwright.dev");
            });

            test("a blog can be liked", async ({ page }) => {
                const blog = await page.locator(".blogDiv").filter({ hasText: "Second" });
                await blog.getByRole("button", { name: "show" }).click();

                const likes = await blog.getByTestId("likesAmount").textContent();
                const likesNumber = Number(likes.slice(7, 1));
                const newLikes = `likes ${likesNumber + 1}`;

                await blog.getByRole("button", { name: "like" }).click();
                await expect(blog.getByText(newLikes)).toBeVisible();
                await expect(blog.getByText(likes)).not.toBeVisible();
            });

            test("a user can delete if it's their blogs", async ({ page }) => {
                const blog = await page.locator(".blogDiv").filter({ hasText: "Second" });
                await blog.getByRole("button", { name: "show" }).click();
                expect(blog.getByText("remove")).toBeVisible();

                page.on("dialog", dialog => dialog.accept());
                await page.getByRole("button", { name: "remove" }).click();

                await expect(blog).not.toBeVisible();
            });

            test("a user that didn't create the blog can't see remove", async ({ page, request }) => {
                await page.getByRole("button", { name: "logout" }).click();
                await request.post("/api/users", {
                    data: {
                        username: "incorrectUser",
                        name: "incorrect name",
                        password: "incorrectpass"
                    }
                });
                await loginWith(page, "incorrectUser", "incorrectpass");

                const blog = await page.locator(".blogDiv").filter({ hasText: "Second" });
                await blog.getByRole("button", { name: "show" }).click();

                expect(blog.getByText("remove")).not.toBeVisible();
            });

            test("blogs are ordered by most to least likes", async ({ page }) => {
                const firstBlog = await page.locator(".blogDiv").filter({ hasText: "First" });
                await firstBlog.getByRole("button", { name: "show" }).click();
                const secondBlog = await page.locator(".blogDiv").filter({ hasText: "Second" });
                await secondBlog.getByRole("button", { name: "show" }).click();
                const thirdBlog = await page.locator(".blogDiv").filter({ hasText: "Third" });
                await thirdBlog.getByRole("button", { name: "show" }).click();

                await firstBlog.getByRole("button", { name: "like" }).click();
                await page.waitForTimeout(1000);
                await firstBlog.getByRole("button", { name: "like" }).click();
                await page.waitForTimeout(1000);
                await secondBlog.getByRole("button", { name: "like" }).click();
                await page.waitForTimeout(1000);
                await secondBlog.getByRole("button", { name: "like" }).click();
                await page.waitForTimeout(1000);
                await secondBlog.getByRole("button", { name: "like" }).click();
                await page.waitForTimeout(1000);
                await thirdBlog.getByRole("button", { name: "like" }).click();
                await page.waitForTimeout(1000);

                await expect(page.locator(".blogDiv").first()).toContainText("Second");
                await expect(page.locator(".blogDiv").nth(1)).toContainText("First");
                await expect(page.locator(".blogDiv").last()).toContainText("Third");
            });
        });
    });
});