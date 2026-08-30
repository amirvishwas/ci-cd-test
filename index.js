const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const JWT_SECRECT = "iamsuperman";
app.use(express.json());

const users = [];

app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  users.push({
    username: username,
    password: password,
  });

  res.json({
    msg: "you are registered",
  });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  let user = users.find((u) => {
    if (u.username == username && password == u.password) {
      return true;
    } else {
      return false;
    }
  });

  if (user) {
    const token = jwt.sign(
      {
        username: username,
      },
      JWT_SECRECT,
    );

    res.json({
      msg: "you are logged in",
      token: token,
    });
  } else {
    res.status(401).json({
      msg: "Invalid username or password",
    });
  }
});

function auth(req, res, next) {
  const token = req.headers.authorization;
  const decode = jwt.verify(token, JWT_SECRECT);
  const username = decode.username;

  if (username) {
    req.username = username;
    next();
  } else {
    res.status(401).json({
      msg: "unauthorized",
    });
  }
}

app.get("/profile", auth, (req, res) => {
  const user = users.find((u) => u.username == req.username);

  if (user) {
    res.json({
      msg: " this is your profile",
    });
  } else {
    res.status(401).json({
      msg: "unauthorized",
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
