## Categories [/categories{?limit,offset}]

+ Parameters
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

### Read all [GET]

+ Request (application/json)

    + Headers

            authToken: adminToken

+ Response 200 (application/json)

        [
          :[](category.json)
        ]

### Create Category of a Campaign [POST /campaigns/{campaign_id}/categories]

+ Parameters
    + campaign_id: `507f191e810c19729de860ea` (string, required) - ObjectId

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

### Read Categories of a Campaign [GET /campaigns/{campaign_id}/categories{?limit,offset}]

+ Parameters
    + campaign_id: `507f191e810c19729de860ea` (string, required) - ObjectId
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

+ Request (application/json)

    + Headers

            authToken: token

+ Response 200 (application/json)

        [
          :[](category.json)
        ]
