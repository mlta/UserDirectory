const express = require("express")
const mustacheExpress = require("mustache-express")
const data = require("./data")
const pgPromise = require("pg-promise")()
const app = express()
const database = pgPromise({ database: "robot-database" })
const bodyParser = require("body-parser")
const expressValidator = require("express-validator")

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())

app.engine("mustache", mustacheExpress())
app.set("views", "./templates")
app.set("view engine", "mustache")

app.get("/", (request, response) => {
  database.any('SELECT * FROM "robots" ').then(robodata => {
    response.render("home", { users: robodata })
  })
})

app.get("/userinfo/:id", (request, response) => {
  // request.params.username
  const id = request.params.id
  database
    .one("SELECT * FROM robots WHERE id = $1", [id])
    //{  id: id})

    .then(robodata => {
      response.render("userinfo", robodata)
    })
})

app.get("/add", (request, response) => {
  response.render("addRobot")
})

app.post("/addId", (request, response) => {
  request.checkBody("username", "You must enter a username").notEmpty()
  let errors = request.validationErrors()

  if (errors) {
    response.render("home", { errors })
  } else {
    const insertRobot = {
      username: request.body.username,
      email: request.body.email,
      university: request.body.university,
      job: request.body.job
    }
    console
      .log(insertRobot)
      .one(
        `INSERT INTO "robots" (username, email, university, job) VALUES ($(username), $(email), $(university), $(job)) RETURNING id`,
        insertRobot
      )
      .then(insertRobotId => {
        robot_id: insertRobotId.id
      })
      .catch(error => {
        console.log(error)
      })

    response.redirect("/")
  }
})
app.delete("/userinfo/:id", (request, response) => {
  const id = request.params.id
  database.none(`DELETE FROM "robots" WHERE id = $1`, [id]).then(() => {
    response.json({ success: true })
  })
})
//   const profileData = {
//     username: request.params.username
//   }
//   function username(user) {
//     return user.username === profileData.username
//   }
//
//   const userData = data.users.find(username)
//   response.render("userinfo", userData)
// })

app.listen(3000, () => {
  console.log("Listening on port 3000")
})
