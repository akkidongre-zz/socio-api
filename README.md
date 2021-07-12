# socio-api

## Development server

Run `node app.js` or `npm start` for a dev server. The server will start in `http://localhost:3000`.

## Design choices

Used MVC architecture and mongodb as database.
2 api routes, controllers and models for user and posts.

## Libraries used
node, express - for the basic setup
bodyparser - To parse the req body
bcrypt - To hash and securely store the password
cors - To allow cors requests
jsonwebtoken - For user session management
mongoose - For creating schemas, models and structuring the data. This is better compared to the std mongodb library
multer - To parse and save the images in files
uuid - To create unique ids for image files

## What can be improved?
1. The architecture is a scalable architecture. But the mongoose models are roughly defined. If there was more time to analyze each and every aspect, each schema would be neatly defined and used.
2. Instead of storing images in files, a cloud server could have been used.
3. Vault could have been used to store mongodb urls. Currently it is exposed to public.
4. When there are more apis and a big application, workers can be used to offload tasks.

## Potential design issues
1. Endpoint definitions
2. File storage is slow and could overflow.
