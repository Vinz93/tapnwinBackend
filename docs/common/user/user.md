## User [/users/{user_id}]

+ Parameters
    + user_id: `507f191e810c19729de860ea` (required, string) - ObjectId

### Read [GET]

+ Request (application/json)

    + Headers

            sessionToken: 507f19dx810c1b7a9de160ea

+ Response 200 (application/json)

        :[](user.json)

### Delete [DELETE]

+ Request (application/json)

    + Headers

            sessionToken: 507f19dx810c1b7a9de160ea

+ Response 204 (application/json)

### Read myself [GET /users/me]

+ Request (application/json)

    + Headers

            sessionToken: 507f19dx810c1b7a9de160ea

+ Response 200 (application/json)

        :[](user.json)

### Update myself [PATCH /users/me]

+ Request (application/json)

    + Headers

            sessionToken: 507f19dx810c1b7a9de160ea

    + Body

            {
                "email": "andres@ludopia.net",
                "password": "654321"
            }

+ Response 204 (application/json)

### Update user's password [PUT /users/password{?recovery_token}]

+ Parameters
    + recovery_token: `5734ed0a1dd3b2b88b35edd2` (string, required)

+ Request (application/json)

    + Body

            {
                "password": "654321"
            }

+ Response 204 (application/json)
