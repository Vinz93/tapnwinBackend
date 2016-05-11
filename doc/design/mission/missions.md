## Missions [/missions]

### Read all [GET]

+ Request (application/json)

    + Headers

            authToken: token

+ Response 200 (application/json)

    [
      ```
      :[](mission.json)
      ```
    ]

### Create [POST]

+ Request (application/json)

    + Headers

            authToken: token

+ Response 200 (application/json)

    ```
    :[](mission.json)
    ```

## Game's missions [/games/{game_id}/missions]

+ Parameters
    + game_id (string) - ObjectId

### Read all [GET]

+ Request (application/json)

    + Headers

            authToken: token

+ Response 200 (application/json)
