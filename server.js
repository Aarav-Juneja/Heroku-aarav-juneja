const app = require("./app")

app.listen(process.env.PORT || 3000, function() {
  console.log("Node sever listening on port 3000!");
});
