## Model [/campaigns/{campaign_id}/models/{model_id}]

+ Parameters
    + campaign_id: `507f191e810c19729de860ea` (string, required) - ObjectId
    + model_id: `507f191e810c19729de860eb` (string, required) - ObjectId

### Read [GET]

+ Request (application/json)

    + Headers

            authToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        :[](model.json)

### Update [PUT]

+ Request (application/json)

    + Headers

            authToken: 5734ed0a1dd3b2b88b35ece3

    + Body

            {
              "url": "http://tapnwin.ludopia.net/api/assets/manikin01.png"
            }

+ Response 204 (application/json)

### Delete [DELETE]

+ Request (application/json)

    + Headers

            authToken: 5734ed0a1dd3b2b88b35ece3

+ Response 204 (application/json)
