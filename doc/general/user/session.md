## Session [/sessions]

### Create [POST]

+ Request (application/json)

        {
            "email": "test@ludopia.net",
            "password": "123456"
        }

+ Response 201 (application/json)

        {
            "authToken":"XXXXXXX"
        }

### Delete [DELETE]

+ Request (application/json)

    + Headers

            authToken: token

+ Response 204
