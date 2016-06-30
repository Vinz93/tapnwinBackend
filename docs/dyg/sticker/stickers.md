## Stickers [/stickers{?limit,offset}]

+ Parameters
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

### Read all [GET]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        :[](stickers.json)

### Create a Model of a Company [POST /companies/{company_id}/stickers]

+ Parameters
    + company_id: `507f191e810c19729de860ea` (string, required) - ObjectId

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

    + Body

            {
              "name": "Sticker01",
              "url": "http://tapnwin.ludopia.net/api/v1/uploads/design/2aae56a0-1da4-422f-bfd2-b599d48e2636.png",
              "isPositive": true
            }

+ Response 201 (application/json)

        :[](sticker.json)

### Read Stickers of a Company [GET /companies/{company_id}/stickers{?limit,offset}]

+ Parameters
    + company_id: `507f191e810c19729de860ea` (string, required) - ObjectId
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        :[](stickers.json)
