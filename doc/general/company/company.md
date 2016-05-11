## Company [/companies/{company_id}]

+ Parameters
    + company_id: `507f191e810c19729de860ea` (required, string) - ID of a Company in the form of an ObjectId

### Read [GET]

+ Request (application/json)

    + Headers

            authToken: adminToken

+ Response 200 (application/json)

        :[](company.json)

### Update [PATCH]

+ Request (application/json)

    + Headers

            authToken: adminToken

+ Response 204 (application/json)

### Delete [DELETE]

+ Request (application/json)

    + Headers

            authToken: adminToken

+ Response 204 (application/json)
