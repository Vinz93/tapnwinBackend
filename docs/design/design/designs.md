## Designs [/designs]

### Read all [GET /designs{?limit,offset}]

+ Parameters
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        [
          :[](design.json)
        ]

### Read all designs of a campaign  [GET /campaigns/{campaign_id}/designs{?limit,offset}]

+ Parameters
    + campaign_id: `507f191e810c19729de860ea` (required, string) - ObjectId
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        [
          :[](design.json)
        ]

### Read all my designs of a campaign [GET /users/me/campaigns/{campaign_id}/designs{?limit,offset}]

+ Parameters
    + campaign_id: `507f191e810c19729de860ea` (required, string) - ObjectId
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        [
          :[](design.json)
        ]

### Create [POST /users/me/designs]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        :[](design.json)
