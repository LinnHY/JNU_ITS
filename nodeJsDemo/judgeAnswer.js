const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "its",
});
const router = express.Router(); // 创建新的路由实例

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(cors());

router.post("/", (req, res) => {
  console.log("req.body=", req.body);
  const { score, answerId } = req.body;
  const insertScore = "UPDATE answer SET score = ? WHERE answerid = ?;";
  connection.query(insertScore, [score, answerId], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "评分失败！" });
    } else {
      res.json({ message: "评分成功" });
    }
  });
});

module.exports = router; // 导出路由实例
