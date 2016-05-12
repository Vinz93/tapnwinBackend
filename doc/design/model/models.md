## Models [/models{?limit,offset}]

+ Parameters
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

### Read all [GET]

+ Request (application/json)

    + Headers

            authToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        [
          :[](model.json)
        ]

### Create a Model of a Campaign [POST /campaigns/{campaign_id}/models]

+ Parameters
    + campaign_id: `507f191e810c19729de860ea` (string, required) - ID of a Campaign in the form of an ObjectId

+ Request (application/json)

    + Headers

            authToken: 5734ed0a1dd3b2b88b35ece3

    + Body

            {
              "url": "http://tapnwin.ludopia.net/api/assets/manikin01.png"
            }

+ Response 201 (application/json)

        :[](model.json)

### Read Models of a Campaign [GET /campaigns/{campaign_id}/models{?limit,offset}]

+ Parameters
    + campaign_id: `507f191e810c19729de860ea` (string, required) - ObjectId
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

+ Request (application/json)

    + Headers

            authToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        [
          :[](model.json)
        ]
