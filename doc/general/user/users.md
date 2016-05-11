## Users [/users]

### Read all [GET]

+ Request (application/json)

    + Headers

            authToken: adminToken

+ Response 200 (application/json)

        [
          :[](user.json),
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
