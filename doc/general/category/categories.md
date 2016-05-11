## Categories [/categories]

### Read all [GET]

+ Request (application/json)

    + Headers

            authToken: adminToken

+ Response 200 (application/json)

        [
          :[](category.json),
          :[](category.json)
        ]

### Create Category of a Campaign [POST /campaigns/{campaign_id}/categories]

+ Parameters
    + campaign_id: `507f191e810c19729de860ea` (string, required) - ID of a Campaign in the form of an ObjectId

+ Request (application/json)

    + Headers

            authToken: token

    + Body

            {
                "campaignId": "507f1f77bcf86cd799439011",
                "zone": "top",
                "items": [
                  {
                    "url": "http://tapnwin.ludopia.net/api/assets/shirt01.png"
                  },
                  {
                    "url": "http://tapnwin.ludopia.net/api/assets/shirt02.png"
                  }
                ]
            }

+ Response 201 (application/json)

        :[](category.json)

### Read Categories of a Campaign [GET /campaigns/{campaign_id}/categories]

+ Parameters
    + campaign_id: `507f191e810c19729de860ea` (string, required) - ID of a Campaign in the form of an ObjectId

+ Request (application/json)

    + Headers

            authToken: token

+ Response 200 (application/json)

        [
          :[](category.json),
          :[](category.json)
        ]
