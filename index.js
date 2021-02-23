const { LOADIPHLPAPI } = require("dns");
const { response } = require("express");
const express = require("express");
const {
  readFileSync,
  writeFileSync,
  appendFileSync,
  unlinkSync,
  readdirSync,
  existsSync,
} = require("fs");
const app = express();

app.use(express.json());
app.use(function (req, res, next) {
  res.setTimeout(1000, () => next());
});

app.post("/b", (req, res) => {
  const taskId = req.body["my-todo"]["date"];
  const fileName = "./task/" + taskId + ".json";
  try {
    if (res.statusCode !== 200) {
      throw new Error(res.statusCode);
    }
    writeFileSync(fileName, JSON.stringify(req.body));
    res.send({
      record: req.body,
      metadata: {
        id: taskId,
      },
    });
  } catch (e) {
    console.error(`Error: ${e} a problem occurred during the POST request`);
    res.status(e).send("test error " + e);
  }
});

app.put("/b/:id", (req, res) => {
  const { id } = req.params;
  const fileName = "./task/" + id + ".json";
  const binExists = existsSync(fileName);
  try {
    if (isNaN(id)) {
      //not a number
      return res.status(400).send({ message: "Illegal ID" });
    }

    if (!binExists) {
      //a number, but doesn't exist
      return res.status(404).send({ message: "Bin not found" });
    }
    if (res.statusCode !== 200) {
      throw new Error(res.statusCode);
    }
    writeFileSync(fileName, JSON.stringify(req.body));
    res.send(req.body);
  } catch (e) {
    console.error(`Error: ${e} a problem occurred during the PUT request`);
    res.status(e).send("test error " + e);
  }
});

app.get("/b/:id", (req, res) => {
  const { id } = req.params;
  const fileName = "./task/" + id + ".json";
  const binExists = existsSync(fileName);
  try {
    if (isNaN(id)) {
      //not a number
      return res.status(400).send({ message: "Illegal ID" });
    }

    if (!binExists) {
      //a number, but doesn't exist
      return res.status(404).send({ message: "Bin not found" });
    }
    if (res.statusCode !== 200) {
      throw new Error(res.statusCode);
    }
    const task = readFileSync(fileName, { encoding: "utf8", flag: "r" });

    res.send({
      record: JSON.parse(task),
      metadata: {
        id: `${fileName.slice(7, 12)}`,
        createdAt: `${new Date()}`,
      },
    });
  } catch (e) {
    console.error(`Error: ${e} a problem occurred during the GET request`);
    res.status(e).send("test error " + e);
  }
});

app.get("/b", (req, res) => {
  try {
    if (res.statusCode !== 200) {
      throw new Error(res.statusCode);
    }
    const binsNamesList = readdirSync("./task/");
    const tasksList = [];
    for (let i = 0; i < binsNamesList.length; i++) {
      const binName = binsNamesList[i];
      try {
        const taskObject = readFileSync("./task/" + binName, {
          encoding: "utf8",
          flag: "r",
        });
        tasksList.push(JSON.parse(taskObject));
      } catch (e) {
        console.error(
          `Error: ${e} There is a problem with the GET ALL request`
        );
      }
    }
    res.send(tasksList);
  } catch (e) {
    console.error(`Error: ${e} There is a problem with the GET request`);
    res.status(e).send("test error " + e);
  }
});

app.delete("/b/:id", (req, res) => {
  const { id } = req.params;
  const fileName = "./task/" + id + ".json";
  const binExists = existsSync(fileName);
  try {
    if (isNaN(id)) {
      //not a number
      return res.status(400).send({ message: "Illegal ID" });
    }

    if (!binExists) {
      //a number, but doesn't exist
      return res.status(404).send({ message: "Bin not found" });
    }
    if (res.statusCode !== 200) {
      throw new Error(res.statusCode);
    }
    unlinkSync("./task/" + id + ".json");
    res.send({ message: "Bin deleted successfully" });
  } catch (e) {
    console.error(`Error: ${e} There is a problem with the DELETE request`);
    res.status(e).send(e);
  }
});

app.delete("/b", (req, res) => {
  try {
    if (response.statusCode !== 200) {
      throw new Error(res.statusCode);
    }
    const binsNamesList = readdirSync("./task/");
    for (let i = 0; i < binsNamesList.length; i++) {
      const binName = binsNamesList[i];
      unlinkSync("./task/" + binName);
    }
    res.send({ message: "All Bins were deleted successfully" });
  } catch (e) {
    console.error(`Error: ${e} There is a problem with the DELETE ALL request`);
    res.status(e).send("test error " + e);
  }
});
app.listen(3000, () => {
  "listen to port 3000";
});

module.exports = app;
