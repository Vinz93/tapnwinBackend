## Campaign Status [/players/me/campaigns/{campaign_id}/campaignStatus]

+ Parameters
    + campaign_id: `57336aaf646a1de8c24efdda` (string, required) - ObjectId

### Read [GET]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        {
          "updatedAt": "2016-06-21T20:10:31.243Z",
          "createdAt": "2016-06-21T20:10:31.243Z",
          "campaign": "57699d7dd827cd3312d8ed3f",
          "player": "57699d7dd827cd3312d8ed41",
          "design": true,
          "balance": 0,
          "id": "57699f377fcb697a123746ec"
        }

### Update [PATCH]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

    + Body

            {
              "design": false,
              "voice": true,
              "balance": 150
            }

+ Response 204 (application/json)
