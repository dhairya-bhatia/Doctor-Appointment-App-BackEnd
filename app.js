const express = require("express") // our express server
const app = express() // generate an app object
const bodyParser = require("body-parser") // requiring the body-parser
const PORT = process.env.PORT || 5000 // port that the server is running on => localhost:5000

app.use(bodyParser.json()) // telling the app that we are going to use json to handle incoming payload

const appRoutes = require('./routes/apiRoutes');
var db = require('./models');
db.sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`); // print this when the server starts
    });
  })
  .catch(() => console.log("Error in DB setup"));


app.use('/', appRoutes);

