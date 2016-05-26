## Players [/players{?limit,offset}]

+ Parameters
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

### Read all [GET]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        [
          :[](player.json)
        ]

### Create [POST]

+ Request (application/json)

        {
            "firstName": "Andres",
            "lastName": "Alvarez",
            "email": "andresa@ludopia.net",
            "password": "123456"
            "gender": "male",
            "age": 23
        }

+ Response 201 (application/json)

        :[](player.json)
