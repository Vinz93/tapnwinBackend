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

### Create Campaign [POST /campaigns]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

    + Body

              {
                "name": "Campaña 1",
                "banner": "Estandarte",
                "startAt": "2015-12-01T17:39:22.939Z",
                "finishAt": "2016-12-01T17:39:22.939Z",
                "company": "507f191e810c19729de860ea",
                "design": {
                  "active": true,
                  "missions": [
                    {
                      "mission": "507f191e810c19729de860ea",
                      "isRequired": true,
                      "isBlocking": false,
                      "blockedTime": 20,
                      "max": 1
                    },
                    {
                      "mission": "507f191e810c19729de860ea",
                      "isRequired": true,
                      "isBlocking": false,
                      "blockedTime": 20,
                      "max": 1
                    },
                    {
                      "mission": "507f191e810c19729de860ea",
                      "isRequired": true,
                      "isBlocking": false,
                      "blockedTime": 20,
                      "max": 10
                    }
                  ],
                  "models": [
                    "507f191e810c19729de860ea"
                  ],
                  "stickers": [
                    "507f191e810c19729de860ea",
                    "507f191e810c19729de860ea",
                    "507f191e810c19729de860ea",
                    "507f191e810c19729de860ea"
                  ],
                  "categories": [
                    {
                      "category": "507f191e810c19729de860ea",
                      "items": [
                        "507f191e810c19729de860ea",
                        "507f191e810c19729de860ea",
                        "507f191e810c19729de860ea",
                        "507f191e810c19729de860ea",
                        "507f191e810c19729de860ea",
                        "507f191e810c19729de860ea"
                      ]
                    },
                    {
                      "category": "507f191e810c19729de860ea",
                      "items": [
                        "507f191e810c19729de860ea",
                        "507f191e810c19729de860ea",
                        "507f191e810c19729de860ea",
                        "507f191e810c19729de860ea",
                        "507f191e810c19729de860ea"
                      ]
                    },
                    {
                      "category": "507f191e810c19729de860ea",
                      "items": [
                        "507f191e810c19729de860ea",
                        "507f191e810c19729de860ea",
                        "507f191e810c19729de860ea",
                        "507f191e810c19729de860ea",
                        "507f191e810c19729de860ea",
                        "507f191e810c19729de860ea"
                      ]
                    },
                    {
                      "category": "507f191e810c19729de860ea",
                      "items": [
                        "507f191e810c19729de860ea",
                        "507f191e810c19729de860ea",
                        "507f191e810c19729de860ea",
                        "507f191e810c19729de860ea",
                        "507f191e810c19729de860ea",
                        "507f191e810c19729de860ea",
                        "507f191e810c19729de860ea",
                        "507f191e810c19729de860ea"
                      ]
                    }
                  ]
                },
                "voice": {
                  "canBeBlocked": true
                },
                "match3": {
                  "canBeBlocked": true
                }
              }

+ Response 201 (application/json)

        :[](campaign.json)
