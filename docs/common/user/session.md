## Session [/sessions]

### Create [POST]

+ Request (application/json)

        {
            "email": "saulg@ludopia.net",
            "password": "123456",
            "type": 0
        }

+ Response 201 (application/json)

        {
            "authToken": "507f19dx810c1b7a9de160ea"
        }

### Delete [DELETE]

+ Request (application/json)

    + Headers

            authToken: 507f19dx810c1b7a9de160ea

+ Response 204
