const userQueries = require("./database/queries/userQueries");

(async () => {
    try {
        const email = `ali${Date.now()}@gmail.com`;

        userQueries.createUser(email, "12345", (err, id) => {
            if (err) {
                console.log("Create Error:", err);
                return;
            }

            console.log("User created with ID:", id);

            userQueries.findUserByEmail(email, (err, user) => {
                if (err) {
                    console.log("Find Error:", err);
                    return;
                }

                if (!user) {
                    console.log("User not found");
                    return;
                }

                console.log("Found User:", user);
            });
        });

    } catch (err) {
        console.log("Test Error:", err);
    }
})();