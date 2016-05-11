## Models [/models]

### Read all [GET]

+ Request (application/json)

    + Headers

            authToken: token

+ Response 200 (application/json)

        [
          :[](model.json),
          :[](model.json)
        ]

### Create a Model of a Campaign [POST /campaigns/{campaign_id}/models]

+ Parameters
    + campaign_id: `507f191e810c19729de860ea` (string, required) - ID of a Campaign in the form of an ObjectId

+ Request (application/json)

    + Headers

            authToken: token

    + Body

            {
              "url": "http://tapnwin.ludopia.net/api/assets/manikin01.png"
            }

+ Response 201 (application/json)

        :[](model.json)

### Read Models of a Campaign [GET /campaigns/{campaign_id}/models]

+ Parameters
    + campaign_id: `507f191e810c19729de860ea` (string, required) - ID of a Campaign in the form of an ObjectId

+ Request (application/json)

    + Headers

            authToken: token

+ Response 200 (application/json)

        [
          :[](model.json),
          :[](model.json)
        ]
