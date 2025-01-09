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

router.get("/getStudentList/:questionId", (req, res) => {
  const questionId = req.params.questionId;

  const sql = "SELECT DISTINCT source_id FROM answer WHERE appliedid = ?";
  const sql3 = "SELECT name FROM user WHERE id = ?";
  connection.query(sql, questionId, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "查询失败" });
    }

    const sourceIds = results.map((result) => result.source_id);
    console.log("sourceIds=", sourceIds);
    const studentList = [];
    sourceIds.forEach((id) => {
      connection2.query(sql3, id, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "查询失败" });
        }
        console.log("id=", id);
        console.log("results=", results);
        const stuName = results[0].name;
        console.log("stuName=", stuName);
        studentList.push({ stuId: id, stuName: stuName });
        if (studentList.length === sourceIds.length) {
          console.log("studentList=", studentList);
          return res.status(200).json(studentList);
        }
      });
    });
  });
});

router.get("/getAnswerList/:stuId/:questionId", (req, res) => {
  const questionId = req.params.questionId;
  const stuId = req.params.stuId;
  const sql2 = `SELECT answerid, numberOfAnswer, score 
                FROM answer 
                WHERE source_id = ${stuId} AND appliedid = ${questionId} 
                ORDER BY numberOfAnswer ASC`;

  connection.query(sql2, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "查询失败" });
    }

    const answerList = results.map((result) => {
      return {
        numberOfAnswer: result.numberOfAnswer,
        answerId: result.answerid,
        score: result.score,
      };
    });
    console.log("answerList=", answerList);
    return res.status(200).json(answerList);
  });
});
router.get("/getStepList/:answerId", (req, res) => {
  const answerId = req.params.answerId;
  const sql4 = `SELECT stepid,content
                  FROM step 
                  WHERE answerId = ${answerId} 
                  ORDER BY stepid ASC`;

  connection.query(sql4, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "查询失败" });
    }

    const stepList = results.map((result) => {
      return {
        stepid: result.stepid,
        content: result.content,
      };
    });
    console.log("stepList=", stepList);
    return res.status(200).json(stepList);
  });
});
module.exports = router; // 导出路由实例
