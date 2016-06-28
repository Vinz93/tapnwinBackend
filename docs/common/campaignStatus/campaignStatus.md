## Campaign Status [/players/me/campaigns/{campaign_id}/campaignStatus]

+ Parameters
    + campaign_id: `57336aaf646a1de8c24efdda` (string, required) - ObjectId

### Read [GET]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        {
          "campaign": "5772bbc93d43bec00e1e0214",
          "createdAt": "2016-06-28T18:03:59.986Z",
          "design": true,
          "match3": false,
          "player": "5772bbc93d43bec00e1e0219",
          "updatedAt": "2016-06-28T18:04:30.712Z",
          "voice": false,
          "balance": 0,
          "id": "5772bc0f9570ecff0e626f8c"
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
