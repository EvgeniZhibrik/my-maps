# my-maps
============
Getting started guide
-----------------------
To run my-maps locally follow next steps:
  1. Clone my-maps repository
  2. Install MongoDB (https://www.mongodb.org/)
  3. Install Node.js (https://nodejs.org/en/)
  4. Sign up for Stormpath (https://api.stormpath.com/register)
  5. Create Stormpath API Key, change /server/config/security.js file: 

        module.exports = {
          apiKeyFile: 'full path for your API Key file',
          application: 'your stormpath application address',
          secretKey: 'any string'
        }

  6. Sign up for Cloudinary (https://cloudinary.com/users/register/free)
  7. Change server/config/cloud.js file:

        module.exports = {
          cloud_name: 'your cloud name',
          api_key: 'your cloud API Key',
          api_secret: 'your cloud secret key'
        };

  8. Change app/assets/js/cloud.js file:

        $.cloudinary.config({"api_key":"your cloud API Key","cloud_name":"your cloud name"});

  9. Use npm install in my-maps folder
  10. Start C:/path_to_mongo/mongod.exe, server/start server.cmd, app/start server.cmd
  11. Enjoy :)
