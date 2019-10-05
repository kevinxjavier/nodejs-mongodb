## Sites
    https://www.mongodb.com/download-center/community
    https://mongoosejs.com/
    https://underscorejs.org/
    https://developers.google.com/identity/sign-in/web/sign-in  # Codigo HTML Google SignInInfo   
    https://console.developers.google.com/apis/                 # API's y Credenciales
    https://console.cloud.google.com/apis                       # Crear Proyecto

    
## Create Heroku Variables
    $ heroku config:set MONGO_URI='mongodb+srv://alex:alex@cluster0-tg9ln.mongodb.net/test'
    $ heroku config:set SEED='Mi-Clave-PROD'
    $ heroku config:set CLIENT_ID='571430740816-b3pv0f6l18dgm17hejj1kils90t3dunb.apps.googleusercontent.com'

## GET
    $ curl -s -X GET 'https://nodejs-mongodb-01.herokuapp.com/usuario?desde=00&limite=5' -H 'cache-control: no-cache' -H 'postman-token: 56b3ff75-5faa-bc01-0557-e6cd61172b53'

    $ curl -s -X GET 'http://localhost:3000/usuario?desde=0&limite=5' -H 'cache-control: no-cache' -H 'postman-token: 95eb0b96-8a70-6f7f-1596-f2c6f93ca421' -H 'token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjp7InJvbGUiOiJVU0VSX1JPTEUiLCJlc3RhZG8iOnRydWUsImdvb2dsZSI6ZmFsc2UsIl9pZCI6IjVkOTUyOWRmMDhlZTIxMmI4NDE3NTZhOCIsIm5vbWJyZSI6IktldmluMTciLCJlbWFpbCI6ImtldmluMTdAa2V2aW5waW5hLmNvbSIsIl9fdiI6MH0sImlhdCI6MTU3MDA1Njg0NSwiZXhwIjoxNTcwMDYwNDQ1fQ.gQ5otOPnYU1cVVzMiHDs011TJURU9397W6UxSnQ3hOM' | jq

