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

### Create [POST /categories]

+ Request (application/json)

    + Headers

            sessionToken: token

    + Body

            {
              "company": "5734ed0a1dd3b2b88b35ece3",
              "name": "Category01",
              "zone": "top",
              "urls": {
                "selected": "http://tapnwin.ludopia.net/api/v1/uploads/design/2aae56a0-1da4-422f-bfd2-b599d48e2636.png",
                "unselected": "http://tapnwin.ludopia.net/api/v1/uploads/design/2aae56a0-1da4-422f-bfd2-b599d48e2636.png"
              }
            }

+ Response 201 (application/json)

        :[](category.json)
