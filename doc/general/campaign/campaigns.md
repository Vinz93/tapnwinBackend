## Campaigns [/campaigns]

### Read all [GET]

+ Request (application/json)

    + Headers

            authToken: adminToken

+ Response 200 (application/json)

        [
            :[](campaign.json),
            :[](campaign.json)
        ]

### Create Campaign of a Company [POST /companies/{company_id}/campaigns]

+ Parameters
    + company_id: `507f191e810c19729de860ea` (string, required) - ID of a Company in the form of an ObjectId

+ Request (application/json)

    + Headers

            authToken: adminToken

    + Body

            {
              "name": "Winter",
              "banner": "Winter favorites clothes!",
              "startAt": "2015-12-01T17:39:22.939Z",
              "finishAt": "2015-12-01T17:39:22.939Z",
              "games": [
                {
                  "gameId": "507f1f77bcf86cd799439011",
                  "missions": [
                    {
                      "missionId": "507f1f77bcf86cd799439011",
                      "isRequired": true,
                      "isBlocking": false,
                      "blockedTime": 20,
                      "max": 3
                    }
                  ]
                }
              ]
            }

+ Response 201 (application/json)

        :[](campaign.json)

### Read Campaigns of a Company [GET /companies/{company_id}/campaigns]

+ Parameters
    + company_id: `507f191e810c19729de860ea` (string, required) - ID of a Company in the form of an ObjectId

+ Request (application/json)

    + Headers

            authToken: adminToken

+ Response 200 (application/json)

        [
            :[](campaign.json),
            :[](campaign.json)
        ]
