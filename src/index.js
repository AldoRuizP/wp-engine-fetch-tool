const logger = require('../logger/winston');
const mysql = require('mysql');
const fs = require('fs');
const { ETSY_DB_HOST, ETSY_DB_USER, ETSY_DB_PASSWORD, ETSY_DB_PORT, ETSY_DB_NAME } = require('../config');

const rawQuery = require('./rawQuery')

const connection = mysql.createConnection({
    host: ETSY_DB_HOST,
    user: ETSY_DB_USER,
    password: ETSY_DB_PASSWORD,
    port: ETSY_DB_PORT,
    database: ETSY_DB_NAME,
    ssl: {
        ca: fs.readFileSync(__dirname + '/wpengine_root_ca.pem')
    },
    flags: '-SSL_VERIFY_SERVER_CERT'
});

connection.connect(function (err) {
    if (err) throw err;

    logger.info("Connected to DB");

    const limit = 10;
    let offset = 0;
    const query = rawQuery.getQuery(limit, offset);

    logger.info("Formed query");

    connection.query(query, function (err, result) { 
        if (err) {
            throw err;
        }
        logger.info("Succesfully executed query");
        const results = JSON.stringify(result)

        logger.info("Writing response to file");
        fs.writeFile(__dirname + '/../payloads/payload_01.json', results, function(err) {
            if (err) { 
                 console.log(err); 
            } 

            connection.end(function(err) {
                logger.info("Finished writing response to file");
            });
        });
    });


});


