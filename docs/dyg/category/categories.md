## Categories [/categories{?limit,offset}]

+ Parameters
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

### Read all [GET]

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        :[](categories.json)

### Create Category of a Company [POST /companies/{company_id}/categories]

+ Parameters
    + company_id: `507f191e810c19729de860ea` (string, required) - ObjectId

+ Request (application/json)

    + Headers

            sessionToken: token

    + Body

            {
                "name": "Category01",
                "zone": "top",
            }

+ Response 201 (application/json)

        :[](category.json)

### Read Categories of a Company [GET /companies/{company_id}/categories{?limit,offset}]

+ Parameters
    + company_id: `507f191e810c19729de860ea` (string, required) - ObjectId
    + limit: `20` (number, optional)
    + offset: `0` (number, optional)

+ Request (application/json)

    + Headers

            sessionToken: 5734ed0a1dd3b2b88b35ece3

+ Response 200 (application/json)

        :[](categories.json)
