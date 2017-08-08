const express = require("express")
const mustacheExpress = require("mustache-express")
const data = require("./data")
const pgPromise = require("pg-promise")()
const app = express()
const database = pgPromise({ database: "robot-database" })
const bodyParser = require("body-parser")

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }))
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
  const insertRobot = {
    username: request.body.username,
    email: request.body.email,
    university: request.body.university,
    job: request.body.job
  }
  console.log(insertRobot)
  database
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
