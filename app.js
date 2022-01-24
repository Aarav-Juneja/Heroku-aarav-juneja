const express = require('express');
const https = require('https');
const app = express();
const http = express();
http.get("*", (req, res) => {
  res.redirect('https://' + req.headers.host + req.url);
})
// The http won't be running anymore
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us17.api.mailchimp.com/3.0/lists/8bd2d58897";
  const options = {
    method: "POST",
    auth: "AaravJ:4c56ee502fe2b5f8c25b55fe09fa3224-us17"
  };
  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.get("/failure", function(req, res) {
  res.redirect("/");
});

// app.get("/todolist", )

app.listen(process.env.PORT || 3000, function() {
  console.log("Node sever listening on port 3000!");
});
