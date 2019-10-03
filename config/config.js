// Turn Off SSL
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Puerto       [VARIABLE HEROKU]
process.env.PORT = process.env.PORT || 3000;

// Entorno      [VARIABLE HEROKU]
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Strign MongoDB Connection
if (process.env.NODE_ENV === 'dev') {
    //url = 'mongodb+srv://alex:alex@cluster0-tg9ln.mongodb.net/test?retryWrites=true&w=majority';    
    url = 'mongodb://localhost:27017/cafe';
} else {
    url = process.env.MONGO_URI;    // [VARIABLE HEROKU creada por nosotros]
}
process.env_URLDB =  url;

// Token 
process.env.CADUCIDAD = '1h'; // 60 * 60;
process.env.SEED = process.env.SEED ||  'Mi-Clave-DEV';

/*
Crear Variable de Entorno Heroku process.env.MONGO_URI
    $ heroku config
    $ heroku config:set nombre="Kevin Piña"
    $ heroku config
    $ heroku config:get nombre
    $ heroku config:unset nombre

    $ heroku config:set MONGO_URI='mongodb+srv://alex:alex@cluster0-tg9ln.mongodb.net/test?retryWrites=true&w=majority'
    $ heroku config:set SEED='Mi-Clave-PROD'
    $ heroku config
*/
