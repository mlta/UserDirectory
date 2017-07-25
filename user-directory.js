const express = require("express")
const mustacheExpress = require("mustache-express")
const data = require("./data")

const app = express()

app.use(express.static("public"))

app.engine("mustache", mustacheExpress())
app.set("views", "./templates")
app.set("view engine", "mustache")

app.get("/", (request, response) => {
  response.render("home", data)
})

app.get("/userinfo/:username", (request, response) => {
  // request.params.username
  const profileData = {
    username: request.params.username
  }
  function username(user) {
    return user.username === profileData.username
  }

  const userData = data.users.find(username)
  response.render("userinfo", userData)
})

app.listen(3000, () => {
  console.log("Listening on port 3000")
})
