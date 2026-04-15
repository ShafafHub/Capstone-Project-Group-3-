const userQueries = require("./database/queries/userQueries");

// 1. First create user
userQueries.createUser("Ali", "ali@gmail.com", "12345", (err, id) => {
    if (err) {
        console.log("Create Error:", err);
    } else {
        console.log("User created with ID:", id);

        // 2. Then find user by email
        userQueries.findUserByEmail("ali@gmail.com", (err, user) => {
            if (err) {
                console.log("Find Error:", err);
            } else {
                console.log("Found User:", user);
            }
        });
    }
});