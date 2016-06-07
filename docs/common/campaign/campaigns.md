## Campaigns [/campaigns{?limit,offset}]

+ Parameters
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

### Read all [GET]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        :[](campaigns.json)

### Create Campaign of a Company [POST /companies/{company_id}/campaigns]

+ Parameters
    + company_id: `507f191e810c19729de860ea` (string, required) - ObjectId

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

    + Body

              {
                "name": "Winter",
                "banner": "Winter favorites clothes!",
                "startAt": "2015-12-06T17:39:22.939Z",
                "finishAt": "2015-12-08T17:39:22.939Z",
                "design": {
                  "active": true,
                  "missions": [{
                    "mission": "5756e70ab3bf52470cd290f4",
                    "isRequired": true,
                    "isBlocking": false,
                    "blockedTime": 20,
                    "max": 3
                  }],
                  "models": [],
                  "stickers": [],
                  "categories": []
                }
              }

+ Response 201 (application/json)

        :[](campaign.json)

### Read Campaigns of a Company [GET /companies/{company_id}/campaigns{?active,limit,offset}]

+ Parameters
    + company_id: `507f191e810c19729de860ea` (string, required) - ObjectId.
    + active: `true` (boolean, optional) - If true, retrieves the active campaign.
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        :[](campaigns.json)

+ Request Active = true (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        :[](campaign.json)
