This is a server for Wordy Club site. This site is a substitution for dictionary. The server contains user details, search words and favourite words of the user. Link to the server -

## Learning Goals

- Database validation using sequelize models.
- Working with docker container to run postgres server.
- Implementing Relations, adding them to sequelize models.
- Generating seeder data.
- Implementing routes in express.
- Separating routes using express Router.
- Using auth middleware to manage authorization routes for routes in express.

## Endpoints

| Method | Path                       | Purpose                                   | required parameters   | auth |
| ------ | -------------------------- | ----------------------------------------- | --------------------- | ---- |
| GET    | '/'                        | Test if your server is running            | none                  | no   |
| POST   | '/echo'                    | Test POST requests                        | none                  | no   |
| POST   | '/signup'                  | Create a new user and get a token         | email, name, password | no   |
| POST   | '/login'                   | Get a token with email & password         | email, password       | no   |
| GET    | '/me'                      | Get information of this user              | none                  | yes  |
| POST   | '/authorized_post_request' | Test POST requests (token required)       | none                  | yes  |
| GET    | '/favouritewords'          | Retrieve all favourite words              | none                  | no   |
| GET    | '/favouritewords/:id'      | Retrieve favourite words based on User ID | userId                | no   |
| POST   | '/favouritewords'          | Insert favourite word into database       | favouriteWord         | yes  |
| DELETE | '/favouritewords'          | Delete favourite word from database       | favouriteWord         | yes  |
| GET    | '/searchhistory'           | Retrieve all search words                 | none                  | no   |
| GET    | '/searchhistory/:userId'   | Retrieve search words based on User ID    | userId                | no   |
| POST   | '/searchhistory'           | Insert search word into database          | searchWord            | no   |
| DELETE | '/searchhistory/:userId'   | Delete search word history from database  | userId                | yes  |
| GET    | '/profiles'                | Retrieve all user data                    | none                  | no   |
| GET    | '/profiles/:userId'        | Retrieve user data based on User ID       | userId                | no   |
| PATCH  | '/profiles/:userId'        | Update user profile                       | name, email, userId   | yes  |

## Database Model Chart

https://app.lucidchart.com/documents/view/bc9317ab-f5d7-4759-ae74-4b0333995ac1/0_0
