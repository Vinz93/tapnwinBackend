## Models [/models{?limit,offset}]

+ Parameters
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

### Read all [GET]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        :[](models.json)

### Create a Model of a Company [POST /companies/{company_id}/models]

+ Parameters
    + company_id: `507f191e810c19729de860ea` (string, required) - ObjectId

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

    + Body

            {
              "name": "manikin01",
              "url": "http://tapnwin.ludopia.net/api/v1/uploads/design/2aae56a0-1da4-422f-bfd2-b599d48e2636.png"
            }

+ Response 201 (application/json)

        :[](model.json)

### Read Models of a Company [GET /companies/{company_id}/models{?limit,offset}]

+ Parameters
    + company_id: `507f191e810c19729de860ea` (string, required) - ObjectId
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        :[](models.json)
