## Companies [/companies]

### Read all [GET]

+ Request (application/json)

    + Headers

            authToken: token

+ Response 200 (application/json)

        [
            :[](company.json),
            :[](company.json)
        ]

### Create [POST]

+ Request (application/json)

    + Headers

            authToken: token

    + Body

            {
                "name": "Levis"
            }

+ Response 201 (application/json)

        :[](company.json)
