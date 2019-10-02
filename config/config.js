// Turn Off SSL
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Puerto       [VARIABLE HEROKU]
process.env.PORT = process.env.PORT || 3000;

// Entorno      [VARIABLE HEROKU]
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Strign MongoDB Connection
if (process.env.NODE_ENV === 'dev') {    
    url = 'mongodb://localhost:27017/cafe';
} else {
    url = process.env.MONGO_URI;
}
process.env_URLDB =  url;

