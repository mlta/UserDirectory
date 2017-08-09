const url = "/userinfo/"

console.log("loaded script")
document.querySelector("#deleteButton").addEventListener("click", function() {
  console.log("button clickedS")
  let id = this.getAttribute("data-id")
  let _url = url + id
  fetch(_url, { method: "delete" }).then(response => response.json()).then(json => {
    window.location = "/"
  })
})
