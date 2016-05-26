## Stickers [/stickers]

### Read all [GET /stickers{?limit,offset}]

+ Parameters
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        [
          :[](sticker.json)
        ]

### Read all stickers of a campaign [GET /campaigns/{campaign_id}/stickers{?limit,offset}]

+ Parameters
    + campaign_id: `507f191e810c19729de860ea` (required, string) - ObjectId
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        [
          :[](sticker.json)
        ]

### Create [POST]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        :[](sticker.json)
