## User [/users/{user_id}]

+ Parameters
    + user_id: `507f191e810c19729de860ea` (required, string) - ID of an User in the form of an ObjectId

### Read [GET]

+ Request (application/json)

    + Headers

            authToken: adminToken

+ Response 200 (application/json)

        :[](user.json)

### Delete [DELETE]

+ Request (application/json)

    + Headers

            authToken: adminToken

+ Response 204 (application/json)

### Read myself [GET /users/me]

+ Request (application/json)

    + Headers

            authToken: token

+ Response 200 (application/json)

        :[](user.json)

### Update myself [PATCH /users/me]

+ Request (application/json)

    + Headers

            authToken: token

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
