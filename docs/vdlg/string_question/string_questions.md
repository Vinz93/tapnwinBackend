## StringQuestion [/asset_questions]

### Create [POST]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

    + Body

        {
            "campaign": "577ea60ee32b11ad1739ae06",
            "personal": "Personal 1",
            "popular": "Popular 1",
            "startAt": "2016-01-01T17:39:22.939Z",
            "finishAt": "2016-12-01T17:39:22.939Z",
            "possibilities": [
              "Respuesta 1a",
              "Respuesta 1b"
            ]
        }

+ Response 201 (application/json)

        :[](string_question.json)
