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
const connection2 = mysql.createConnection({
  host: "1.12.235.165",
  user: "knowledgepr1",
  password: "Gtj20010516-",
  database: "knowledgepr1",
});
const router = express.Router(); // 创建新的路由实例

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.use(cors());

router.post("/", (req, res) => {
  console.log("req.body=", req.body);
  const { appliedId, stepArr, source_id, role } = req.body;
  const Verification = "SELECT id FROM user WHERE id=?";
  connection2.query(Verification, source_id, (err, result) => {
    if (err || result.length == 0) {
      console.log(err);
      res.status(500).json({ message: "提交答案失败！" });
    } else {
      // 查询当前最大的id值
      const getMaxIdSql = "SELECT MAX(answerid) AS maxId FROM answer";
      connection.query(getMaxIdSql, (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "提交答案失败！" });
        } else {
          const maxId = result[0].maxId;
          const getMaxNumberSql =
            "SELECT MAX(numberOfAnswer) AS maxNumber FROM answer where source_id=? and appliedid=?";
          connection.query(
            getMaxNumberSql,
            [source_id, appliedId],
            (err, res2) => {
              if (err) {
                console.log(err);
                res2.status(500).json({ message: "提交答案失败！" });
              } else {
                const maxNumber = res2[0].maxNumber;
                const newMaxNumber = maxNumber ? maxNumber + 1 : 1;
                const newId = maxId ? maxId + 1 : 1;
                let isCorrected = role == 1 ? 1 : 0;
                let isSample = role == 1 ? 1 : 0;
                // 将数据保存到数据库中的answer表
                const sql = `INSERT INTO answer (answerid, source_id, isCorrected, isSample, appliedid,numberOfAnswer) VALUES (?, ?, ?, ?, ?,?)`;
                connection.query(
                  sql,
                  [
                    newId,
                    source_id,
                    isCorrected,
                    isSample,
                    appliedId,
                    newMaxNumber,
                  ],
                  (err, result) => {
                    if (err) {
                      console.log(err);
                      res.status(500).json({ message: "提交答案失败！" });
                    } else {
                      console.log("newMaxNumber=", newMaxNumber);
                      res.json({ message: "提交答案成功" });
                    }
                  }
                );
                // 将数据保存到数据库中的step表
                const sql2 = `INSERT INTO step (stepid, content, answerid) VALUES (?, ?, ?)`;
                for (i = 0; i < stepArr.length; i++) {
                  if (Array.isArray(stepArr[i])) {
                    connection.query(sql2, [
                      i,
                      JSON.stringify(stepArr[i]),
                      newId,
                    ]);
                  } else connection.query(sql2, [i, stepArr[i], newId]);
                }
              }
            }
          );
        }
      });
    }
  });
});

module.exports = router; // 导出路由实例
