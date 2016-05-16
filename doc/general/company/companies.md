## Companies [/companies{?limit,offset}]

+ Parameters
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

### Read all [GET]

+ Request (application/json)

    + Headers

            authToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        [
            :[](company.json)
        ]

### Create [POST]

+ Request (application/json)

    + Headers

            authToken: 5734ed0a1dd3b2b88b35ece3

    + Body

            {
                "name": "Levis"
            }

+ Response 201 (application/json)

        :[](company.json)
