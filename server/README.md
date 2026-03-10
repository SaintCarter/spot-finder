#database_schema

spot
spot_post
spot_type
spot_rating
spot_post_vote

user
user_skateboard


log_history
security_flags

spot
    - id (PK)
    - name
    - description
    - address
    - latitude
    - longitude
    - hasSecurity (boolean)
    - spotTypeId 
    - createdBy (userId FK)
    - createdAt
    - updatedAt

spot_type (rail, skatepark, stairs etc)
    - id
    - name


spot_post
    - id (PK)
    - spotId (FK)
    - creatorId (FK user.id)
    - caption
    - postUrl
    - postType
    - createdAt
    - updatedAt

spot_rating
    - spotId
    - userId
    - rating (1-5)

spot_post_vote
    - spotPostId
    - userId
    - voteType (thunbs up or down)


user
    -id
    -username
    -hashedPassword
    -phoneNumber
    -favouriteBoardId (user_skateboard.id)

user_skateboard
    -userid
    -id
    -boardUrl


log_history
    - ipAddress
    - userAgent
    - path
    - body json
    - timestamp
    - cookie

security_flags
    - ipAddress
    - userAgent
    - path
    - body json
    - timestamp
    - cookie
    - message
    - userId
    - location json http://ip-api.com/json/IPADDRESS