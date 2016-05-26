## Administrators [/administrators{?limit,offset}]

+ Parameters
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

### Read all [GET]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        [
          :[](administrator.json)
        ]

### Create [POST]

+ Request (application/json)

        {
            "email": "andresa@ludopia.net",
            "password": "123456"
        }

+ Response 201 (application/json)

        :[](administrator.json)
