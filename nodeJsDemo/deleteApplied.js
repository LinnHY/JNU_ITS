const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
// 创建与MySQL数据库的连接
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "its",
});

const router = express.Router(); // 创建新的路由实例
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// 删除单个题目
router.get("/:id", (req, res) => {
  const id = req.params.id;

  // First Step: Delete all rows in the applied_belong_kid table where appliedid equals id
  const deleteSql = "DELETE FROM applied_belong_kid WHERE appliedId = ?";
  connection.query(deleteSql, [id], (err, deleteResult) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "删除题目数据失败！" });
    } else {
      // Second Step: Select all answerids from the answer table where appliedid equals id
      const selectSql = "SELECT answerid FROM answer WHERE appliedid = ?";
      connection.query(selectSql, [id], (err, selectResult) => {
        if (err) {
          console.log(err);
          res.status(500).json({ message: "删除题目数据失败！" });
        } else {
          const answerIds = selectResult.map((item) => {
            return item.answerid;
          });

          // Third Step: Delete all rows from the step table where answerid belongs to the answerIds array
          const deleteSql2 = `DELETE FROM step WHERE answerid IN (SELECT answerid FROM answer WHERE appliedid = ?)`;
          connection.query(deleteSql2, [id], (err, deleteResult2) => {
            if (err) {
              console.log(err);
              res.status(500).json({ message: "删除题目数据失败！" });
            } else {
              // Fourth Step: Delete all rows in the answer table where appliedid equals id
              const deleteSql3 = "DELETE FROM answer WHERE appliedid = ?";
              connection.query(deleteSql3, [id], (err, deleteResult3) => {
                if (err) {
                  console.log(err);
                  res.status(500).json({ message: "删除题目数据失败！" });
                } else {
                  // Fifth Step: Get the updated data for the applied row
                  const sql = "DELETE FROM igsys_applied WHERE id = ?";
                  connection.query(sql, [id], (err, result) => {
                    if (err) {
                      console.log(err);
                      res.status(500).json({ message: "删除题目数据失败！" });
                    } else {
                      res.json(result);
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

module.exports = router; // 导出 app 对象
