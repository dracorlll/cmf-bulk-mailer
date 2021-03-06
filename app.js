const express = require('express')
const router = require("./routes/router")
const bodyParser = require("body-parser")
const exphbs = require("express-handlebars")

//express
const port = 3000
const app = express()
app.use(express.static('public'))

//bodyparser
app.use(
    bodyParser.urlencoded({
        extended: true
    })
)
app.use(bodyParser.json())

//handlebars
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

//Router
app.use("/", router)

//Makes the app listen to port 3000
app.listen(port, () => console.log('Running on port: ', port))





