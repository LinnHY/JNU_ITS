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

// 获取所有可用的题目ID列表
router.get("/ids", (req, res) => {
  const sql = `
  SELECT a.id, a.title, a.difficulty, GROUP_CONCAT(b.kid) AS relatedKps
  FROM igsys_applied a
  LEFT JOIN applied_belong_kid b ON a.id = b.appliedid
  LEFT JOIN knowledge_point c ON b.kid = c.kid
  GROUP BY a.id
  `;
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "获取题目ID列表失败！" });
    } else {
      const ids = result.map((item) => {
        return {
          id: item.id,
          title: item.title,
          difficulty: item.difficulty,
          relatedKps: item.relatedKps
            ? item.relatedKps.split(",").map((item) => {
                return Number(item);
              })
            : [],
        };
      });
      res.json(ids);
    }
  });
});

// 获取所有可用的知识点列表
router.get("/kps", (req, res) => {
  const sql = "SELECT kid, knowledge_name FROM knowledge_point";
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "获取知识点列表失败！" });
    } else {
      const kps = result.map((item) => {
        return { id: item.kid, name: item.knowledge_name };
      });
      res.json(kps);
    }
  });
});

// 获取单个题目的具体数据
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM igsys_applied WHERE id = ?";
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "获取题目数据失败！" });
    } else {
      if (result.length === 0) {
        res.status(404).json({ message: "该题目不存在！" });
      } else {
        const data = result[0];
        const sql2 = "SELECT kid FROM applied_belong_kid WHERE appliedId = ?";
        connection.query(sql2, [id], (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({ message: "获取题目数据失败！" });
          } else {
            const relatedKps = result.map((item) => {
              return item.kid;
            });
            data.relatedKps = relatedKps;
            res.json(data);
          }
        });
      }
    }
  });
});

// 获取单个题目的具体数据
router.get("/getNumberOfAnswer/:id/:source_id", (req, res) => {
  const id = req.params.id;
  const source_id = req.params.source_id;
  const sql = `
    SELECT a.numberOfAnswer, a.answerid
    FROM answer a
    WHERE a.appliedid = ${id} AND a.source_id = ${source_id}
    ORDER BY a.numberOfAnswer DESC
    LIMIT 1
  `;
  // 执行查询
  connection.query(sql, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (results.length === 0) {
      res.status(200).json({ maxNumberOfAnswer: 0, stuHistoryArr: [] });
      return;
    }

    // 获取最大的numberOfAnswer和对应的answerid
    const maxNumberOfAnswer = results[0].numberOfAnswer;
    const answerid = results[0].answerid;

    const sql2 = `
      SELECT s.content
      FROM step s
      WHERE s.answerid = ${answerid}
      ORDER BY s.stepid ASC
    `;
    // 执行查询
    connection.query(sql2, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      // 获取结果数组
      const stuHistoryArr = results.map((row) => row.content);

      // 返回结果给前端
      res.status(200).json({ maxNumberOfAnswer, stuHistoryArr });
    });
  });
});

module.exports = router; // 导出 app 对象
