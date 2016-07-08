## Question [/questions/{question_id}]

+ Parameters
    + question_id: `507f191e810c19729de860ea` (required, string) - ObjectId

### Read [GET]

+ Response 200 (application/json)

        :[](question.json)

### Read statistics [GET /questions/{question_id}/statistics]

+ Response 200 (application/json)

        {
            "counts": [
                0,
                1
            ],
            "percents": [
                0,
                100
            ],
            "total": 1
        }
