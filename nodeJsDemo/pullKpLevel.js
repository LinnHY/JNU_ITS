const express = require("express");
const mysql = require("mysql2");

// 创建与MySQL数据库的连接
const connection = mysql.createConnection({
  host: "1.12.235.165",
  user: "knowledgepr1",
  password: "Gtj20010516-",
  database: "knowledgepr1",
});
const router = express.Router(); // 创建新的路由实例
router.get("/:stu_id/:kid", (req, res) => {
  const stu_id = req.params.stu_id;
  const kid = req.params.kid;

  const sql = `
  SELECT knowledge_name, kp_level
  FROM knowledge_level
  LEFT JOIN knowledge_point ON knowledge_level.kid = knowledge_point.kid
  WHERE stu_id = ? AND knowledge_point.kid = ?
`;
  connection.query(sql, [stu_id, kid], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "获取知识点掌握度失败！" });
    } else {
      console.log("result==", result);
      if (result.length === 0) {
        // 如果不存在记录
        // 到 knowledge_point 表中查询对应的 knowledge_name
        const sql2 = `SELECT knowledge_name FROM knowledge_point WHERE kid = ?`;
        connection.query(sql2, [kid], (err2, result2) => {
          if (err2) {
            console.log(err2);
            res.status(500).json({ message: "获取知识点掌握度失败！" });
          } else {
            const knowledge_name = result2[0].knowledge_name;
            res.json({ kp_level: 0.1, knowledge_name });
          }
        });
      } else {
        // 如果存在记录

        const kp_level = result[0].kp_level;
        const knowledge_name = result[0].knowledge_name;
        res.json({ kp_level, knowledge_name });
      }
    }
  });
});
module.exports = router; // 导出 app 对象
