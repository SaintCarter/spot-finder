
## SERVER STRUCTURE:

this server is meant to respond to requests made by logged in users on spot-finder-client-2026 react + vite website

this server always responds in one of the following formats:

    1. {message: "updated account succefully"} 
    2. {error: "unable to update account"}
    3. {data: data, otherData: otherData ....... etc}


we use the response status(200,401,etc) to tell whether the request was successful or not. (if (!response.ok) = unsuccessful  else: successful)

# spot-finder-client-2026 should use the following formats as following:

FAIL:

(2){error: ""}
# for actions that dont require a specific error message such as attempting to create a spot, if all the fields are filled out properly then when you submit, it either works or it doesn't, telling the user that there is a supabase error doesnt help them. (this is worst case scenario and shouldnt happen to users ever) also notice the response.error is never used. in this case the message is just as our standard but makes conversations clearer on the network level. we also console log a message for ourselves to make debugging easy. again users should not experience these lines of code.
if (!response.ok) {
    throw new Error('fail message');
}
catch(error){
    console.err('functionName Error: ', error);
    return{success: false};
}


(2){error: "fail"}
# for actions that require a specific error message to let the user know what went wrong so they can do something about it for example if there was an error uploading one of the images, letting the user know can help them make the necessary change instead of just being denied.
if(!response.ok){
    const res = await response.json();
    return { success: false, error: res.error };
}


SUCCESS:


(1) {message: "success"} 
# for actions that dont need data back from the server for example rating a spot you just need a success message which can be provided by frontend after recieving 200 ok response from the server. this message is simply a curtesy which also makes conversations clearer on the network level
return { success: true };

(3) {data: data}
# for actions that need data back from the server for example requesting to see a users profile data.
const res = await response.json();
return {res.data}



notice the object {success: Boolean} is always created by the frontend, to be used by the frontend.
notice the objects {error: String} and {data: Object}  are created by the backend and used by the frontend. 
notice the object {message: String} is never used by anyone except admins analysing requests at the network level.


therefor:
{error: String}, {data: Object}

are the only objects that the frontend actually uses and needs to worry about handling from the backend. otherwise it is a simple success or fail given by the status number


the server should always send data retrieved from the database, cleaned and formatted properly for the frontend.



## SERVER AUTHENTICATION

This server requires a jsonwebtoken to reach any endpoints that arent involved in creating an account or logging in.

creating an account we check if the email and username are unique and if not we send the respective error message and if yes, then we insert into the users table.
logging in we check if the username and password match any records in the users table, if not then send error, if yes then we sign a jsonwebtoken with our secret key and attach the users role, id, username and give it the the user as credentials pass AuthCheck.js which blocks all other endpoints.

all other endpoints are protected by AuthCheck.js which expects req.cookies.spotfinder_access_token. 
it checks the token using jwt.verify(token, process.env.JWT_SECRET);
the response determines whether access to the next proccess is granted or not.

if a client presents our server with a valid token, it is mathematically guaranteed that the token was signed using our JWT SECRET, so, the server proceeds to run the requested process which potentially uses some of the trusted data provided in the JWT token. the requested process is usually some sort of database action, but can also be another service such as handling files with multer that we wouldnt want to even bother attempting unless the user was logged in, the req data is proper, and they haven't done the same action x times in the past x minutes.
if the token is valid and we want to perform a database action, we must establish access control. to establish whether the user making the request should be allowed to perform the action they desire, we use the userId found in the trusted JWT token and in some cases the role(user/admin).

as you can see at both the server uses the JWT as the source of truth to grant access.
that being said an attackers root targets are:
-GITHUB LOGIN
-SUPABASE/DB LOGIN

an attackers possibilities might be:
-leaked JWT SECRET
-leaked DB SERVICE KEY
-find misconfigured endpoints (forgot to add AuthCheck middleware)
-denial of service(spam server and/or db, creating unrelated/fake posts and spots, spamming create account to hord common usernames/emails,)
-sql injection specifically the create Spot (inserting into Spot table) approved column as that column should only ever be updated by the admin because it governs whether users should see it or not. by exploiting this, an attacker could create spots that will be shown to all users without admin approval. and skate spots are the main function of the actual service provided so essentially would be denial of service via sql injection. you could say privilige escilation as a user is executing an admin only request, but the role never changed. ***fortunately we explicitly set approved to false in the insert call from our server***
-XSS
-privilige escilation(role)
-token theft


if an attacker was able to access our github or db login or somehow get one of the keys *i should look into possibilities of that* they would have full control over the system. this is known as a 10/10 critical vulnerability.

other than that, i believe, poisoning the jwt token, misconfigured endpoints, and denial of service are the systems main attack points that we need to handle.

Note that standard practices prevent total destruction in cases of a 10/10 vulnerability by redundantly storing backups regularily.
Note that standard practices such as strong password, 2FA, etc also attempt to prevent the succession of an attack on any of the root level targets.

is there anything else we can do to protect the root targets?:
1.GITHUB
- branch protection
- MFA
2.SUPABASE
- redundant backups
- recovery plan
- MFA
- IP whitelist??


things we know we can do to prevent the attacks possible:
1. DOS
- AWS/CloudFlare
- ExpressRateLimiter
2. SQL INJECTION
- ZOD
- param queries
- input enforcement
3. MISCONFIGED_ENDPOINTS
- redundant analysis
- use ai
4. TOKEN THEFT
- short expiry
- httpOnly
- secure
5. XSS
- helmet
- zod
- react
6. LEAKED KEYS
- i take standard practice very seriously
- seperate production / dev keys 
- use scan tools to verify
7. PRIV ESCALATION
- role based access control using trusted JWT claims.




Note there are a few db actions(selecting spot data) that are allowed to made using the anon key by the frontend for accessability purposes.


 







