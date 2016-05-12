## Users [/users{?limit,offset}]

+ Parameters
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

### Read all [GET]

+ Request (application/json)

    + Headers

            authToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        [
          :[](user.json)
        ]

### Create [POST]

+ Request (application/json)

        {
            "firstName":"Joao",
            "lastName":"Sanchez",
            "gender": "male",
            "age": 23,
            "email": "joao@ludopia.net",
            "password": "123456"
        }

+ Response 201 (application/json)

        :[](user.json)
