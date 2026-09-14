const { test } = require("vitest");
const { auth } = require("../auth");

test("create test user", async () => {
    const ctx = await auth.$context;
    const testUtils = ctx.test;

    const user = testUtils.createUser({
        email: "test@example.com",
        name: "Test User",
        emailVerified: true
    });

    const savedUser = await testUtils.saveUser(user);

    console.log("User created:", savedUser.id);
});