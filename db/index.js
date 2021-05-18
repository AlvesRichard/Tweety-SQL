const postgres= require('pg');

// CREAR EL CLIENTE
const client = new postgres.Client({
    connectionString: 'postgres://postgres:postgres@localhost/tweetydb'
});

// CONECTAR EL CLIENTE
client.connect((error,data)=>{
    if(error) console.log(error);
    console.log("Se conecto correctamente");
});

// EXPORTAMOS
module.exports = client;