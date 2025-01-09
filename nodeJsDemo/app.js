const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

const pullApplied = require("./pullApplied");
const pushApplied = require("./pushApplied");
const pushAnswer = require("./pushAnswer");
const pullKpLevel = require("./pullKpLevel");
const pullAnswer = require("./pullAnswer");
const pullRelation = require("./pullRelation");
const deleteApplied = require("./deleteApplied");
const checkAnswer = require("./checkAnswer");
const judgeAnswer = require("./judgeAnswer");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// 合并 pullApplied 和 pushApplied 的路由
app.use("/api/knowledgepr/igsys_applied/pullApplied", pullApplied);
app.use("/api/knowledgepr/igsys_applied/pushApplied", pushApplied);
app.use("/api/knowledgepr/igsys_applied/pushAnswer", pushAnswer);
app.use("/api/knowledgepr/igsys_applied/pullKpLevel", pullKpLevel);
app.use("/api/knowledgepr/igsys_applied/pullAnswer", pullAnswer);
app.use("/api/knowledgepr/igsys_applied/pullRelation", pullRelation);
app.use("/api/knowledgepr/igsys_applied/deleteApplied", deleteApplied);
app.use("/api/knowledgepr/igsys_applied/checkAnswer", checkAnswer);
app.use("/api/knowledgepr/igsys_applied/judgeAnswer", judgeAnswer);
const PORT = process.env.PORT || 3000;
app.get("/getNameAndRole", (req, res) => {
  console.log(req.query);
  res.send(req.query);
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
