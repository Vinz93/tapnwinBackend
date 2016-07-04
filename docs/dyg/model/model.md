## Model [/companies/{company_id}/models/{model_id}]

+ Parameters
    + company_id: `507f191e810c19729de860ea` (string, required) - ObjectId
    + model_id: `507f191e810c19729de860eb` (string, required) - ObjectId

### Read [GET]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        :[](model.json)

### Update [PUT]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

    + Body

            {
              "name": "manikin01",
              "url": "http://tapnwin.ludopia.net/api/v1/uploads/design/2aae56a0-1da4-422f-bfd2-b599d48e2636.png"
            }

+ Response 204 (application/json)

### Delete [DELETE]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 204 (application/json)
