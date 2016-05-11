## Category [/campaigns/{campaign_id}/categories/{category_id}]

+ Parameters
    + campaign_id: `507f191e810c19729de860ea` (string, required) - ID of a Campaign in the form of an ObjectId
    + category_id: `507f191e810c19729de860eb` (string, required) - ID of a Category in the form of an ObjectId

### Read [GET]

+ Request (application/json)

    + Headers

            authToken: token

+ Response 200 (application/json)

        :[](category.json)

### Create [PUT]

+ Request (application/json)

    + Headers

            authToken: token

    + Body

            {
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

+ Response 204 (application/json)

### Delete [DELETE]

+ Request (application/json)

    + Headers

            authToken: token

+ Response 204 (application/json)
