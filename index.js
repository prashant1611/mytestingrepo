const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8001;

//middleware - plugin
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  console.log("hello from middleware 1");
  next();
});

//Routes
app.get("/users", (req, res) => {
  const html = `
<ul>
${users.map((user) => `<li>${user.first_name}</li>`).join("")}
</ul>
`;
  res.send(html);
});

app.get("/api/users", (req, res) => {
  return res.json(users);
});

app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.filter((user) => user.id === id);
  return res.json(user);
});

//post
app.post("/api/users", (req, res) => {
  const body = req.body;
  if (
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res
      .status(400)
      .json({ msg: "bad request - missing requird parameter" });
  }
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.status(201).json({ status: "sucess", id: users.length });
  });
});

app.listen(PORT, () => {
  console.log(`server is started at port ${PORT}`);
});
