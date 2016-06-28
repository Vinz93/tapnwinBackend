## Missions [/missions]

### Read all [GET /missions{?limit,offset}]

+ Parameters
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        :[](missions.json)

### Create [POST]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

    + Body

              {
                "code": "0002",
                "description": "Misión2"
              }

+ Response 200 (application/json)

        :[](mission.json)
