## My vote [/votes/{vote_id}]

+ Parameters
    + vote_id: `5733737c346588ad7610bcb0` (string, required) - ObjectId

### Read [GET]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        :[](vote.json)

### Update [PATCH /users/me/votes/{vote_id}]

+ Parameters
    + vote_id: `5733737c346588ad7610bcb0` (string, required) - ObjectId

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        :[](vote.json)

### Delete [DELETE]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)
