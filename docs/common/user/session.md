## Session [/sessions{?type}]

+ Parameters
    + type: `Player` (string, optional)

### Create [POST]

+ Request (application/json)

        {
            "email": "saulg@ludopia.net",
            "password": "123456"
        }

+ Response 201 (application/json)

        {
            "sessionToken": "507f19dx810c1b7a9de160ea"
        }

### Delete [DELETE]

+ Request (application/json)

    + Headers

            sessionToken: 507f19dx810c1b7a9de160ea

+ Response 204
