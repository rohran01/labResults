var connectionString = '';

if(process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    // connectionString = 'postgres://localhost:5432/labresults';                                 //Testing at home
    connectionString = 'postgres://postgres:retro1invert@localhost:5432/labresults';              //Testing at work
}

module.exports = connectionString;
