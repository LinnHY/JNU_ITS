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
router.get("/knowledge_point", (req, res) => {
  const kids = req.query.kids.split(",");
  console.log("kids=", kids);
  const sql = `SELECT kid,knowledge_name,video_url,pdf_url FROM knowledge_point WHERE kid IN (${kids
    .map((kid) => `'${kid}'`)
    .join(",")})`;

  connection.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    } else {
      console.log("knowledge_point的result=", result);
      res.status(200).json(result);
    }
  });
});
// 查询 knowledge_relation 表中的数据
router.get("/knowledge_relation", (req, res) => {
  // /knowledge_relation?kids=13,8
  const kids = req.query.kids.split(",");
  console.log("kids=", kids);
  const sql = `SELECT * FROM knowledge_relation WHERE sub_knowledge_id IN (${kids
    .map((kid) => `'${kid}'`)
    .join(",")})`;

  connection.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    } else {
      console.log("knowledge_relation的result=", result);
      res.status(200).json(result);
    }
  });
});
router.get("/kps", (req, res) => {
  const sql = "SELECT kid, knowledge_name, chapter FROM knowledge_point";
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "获取知识点列表失败！" });
    } else {
      const kps = result.map((item) => {
        return {
          id: item.kid,
          name: item.knowledge_name,
          chapter: item.chapter,
        };
      });
      res.json(kps);
    }
  });
});
module.exports = router; // 导出 app 对象
