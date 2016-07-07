## Campaign [/campaigns/{campaign_id}]

+ Parameters
    + campaign_id: `507f191e810c19729de860ea` (string, required) - ObjectId

### Read [GET]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        :[](campaign.json)

### Update [PATCH]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

    + Body

            {
              "name": "Winter",
              "banner": "Winter favorites clothes!",
              "startAt": "2015-12-01T17:39:22.939Z",
              "finishAt": "2015-12-01T17:39:22.939Z",
            }

+ Response 204 (application/json)

### Delete [DELETE]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 204 (application/json)
