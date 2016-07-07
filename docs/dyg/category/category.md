## Category [/categories/{category_id}]

+ Parameters
    + category_id: `507f191e810c19729de860eb` (string, required) - ObjectId

### Read [GET]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        :[](category.json)

### Update [PATCH]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

    + Body

            {
                "name": "Category01",
                "zone": "bottom",
            }

+ Response 204 (application/json)

### Delete [DELETE]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 204 (application/json)
