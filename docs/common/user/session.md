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
            "sessionToken": "5772bbc93d43bec00e1e0219JYMWYhRMU3JckiUS"
        }

### Delete [DELETE]

+ Request (application/json)

    + Headers

            sessionToken: 5772bbc93d43bec00e1e0219JYMWYhRMU3JckiUS

+ Response 204
