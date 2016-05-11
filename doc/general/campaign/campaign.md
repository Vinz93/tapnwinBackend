## Campaign [/companies/{company_id}/campaigns/{campaign_id}]

+ Parameters
    + company_id: `507f191e810c19729de860ea` (string, required) - ID of a Company in the form of an ObjectId
    + campaign_id: `507f191e810c19729de860ea` (string, required) - ID of a Campaign in the form of an ObjectId

### Read [GET]

+ Request (application/json)

    + Headers

            authToken: token

+ Response 200 (application/json)

        :[](campaign.json)

### Update [PUT]

+ Request (application/json)

    + Headers

            authToken: token

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

+ Response 204 (application/json)

### Delete [DELETE]

+ Request (application/json)

    + Headers

            authToken: token

+ Response 204 (application/json)
