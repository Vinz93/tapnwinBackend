## Votes [/votes]

### Read all [GET /votes{?limit,offset}]

+ Parameters
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        [
          :[](vote.json)
        ]

### Create [POST /players/me/votes]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        :[](vote.json)

### Read all of my design [GET /players/me/designs/{design_id}/votes]

+ Parameters
    + design_id: `5733737c346588ad7610bcb0` (string, required) - ObjectId

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        [
          :[](vote.json)
        ]

### Read votes statistics of a design [GET /designs/{design_id}/votes/statistics]

+ Parameters
    + design_id: `5733737c346588ad7610bcb0` (string, required) - ObjectId

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)
