## Answers [/answers]

### Read all [GET /answers{?limit,offset}]

+ Parameters
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        :[](answers.json)

### Read all by Player [GET /players/me/answers{?limit,offset}]

+ Parameters
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        :[](answers.json)

### Read statistics by Player [GET /players/me/answers/statistics]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        {
            "correct": 1,
            "total": 2,
            "percent": 50
        }

### Create by Player [POST /players/me/answers]

+ Request (application/json)

        {
          "question": "507f191e810c19729de860ea",
          "personal": 1,
          "popular": 2
        }

+ Response 201 (application/json)

        :[](answer.json)
