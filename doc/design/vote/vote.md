## My vote [/users/me/votes/{vote_id}]

+ Parameters
    + vote_id (string) - ObjectId

### Read [GET]

+ Request (application/json)

    + Headers

            authToken: token

+ Response 200 (application/json)

        :[](vote.json)

### Update [POST]

+ Request (application/json)

    + Headers

            authToken: token

+ Response 200 (application/json)

        :[](vote.json)

### Delete [DELETE]

+ Request (application/json)

    + Headers

            authToken: token

+ Response 200 (application/json)
