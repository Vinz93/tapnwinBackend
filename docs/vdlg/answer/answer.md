## Answer [/answers/{answer_id}]

+ Parameters
    + answer_id: `507f191e810c19729de860ea` (required, string) - ObjectId

### Read [GET]

+ Request (application/json)

    + Headers

            sessionToken: 507f19dx810c1b7a9de160ea

+ Response 200 (application/json)

        :[](answer.json)

### Update by Player [PATCH /players/me/answers/{answer_id}]

+ Parameters
    + answer_id: `507f191e810c19729de860ea` (required, string) - ObjectId

+ Request (application/json)

    + Headers

            sessionToken: 507f19dx810c1b7a9de160ea

    + Body

            {
                "seen": false,
            }

+ Response 204 (application/json)
