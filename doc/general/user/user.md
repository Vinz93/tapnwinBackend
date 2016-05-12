## User [/users/{user_id}]

+ Parameters
    + user_id: `507f191e810c19729de860ea` (required, string) - ObjectId

### Read [GET]

+ Request (application/json)

    + Headers

            authToken: 507f19dx810c1b7a9de160ea

+ Response 200 (application/json)

        :[](user.json)

### Delete [DELETE]

+ Request (application/json)

    + Headers

            authToken: 507f19dx810c1b7a9de160ea

+ Response 204 (application/json)

### Read myself [GET /users/me]

+ Request (application/json)

    + Headers

            authToken: 507f19dx810c1b7a9de160ea

+ Response 200 (application/json)

        :[](user.json)

### Update myself [PATCH /users/me]

+ Request (application/json)

    + Headers

            authToken: 507f19dx810c1b7a9de160ea

    + Body

            {
                "firstName":"Andres",
                "lastName":"Alvarez",
                "gender": "male",
                "age": 23,
                "email": "andres@ludopia.net",
                "password": "654321"
            }

+ Response 204 (application/json)
