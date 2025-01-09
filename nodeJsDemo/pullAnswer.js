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

router.get("/:id", (req, res) => {
  const { id } = req.params;

  // 查询满足条件的第一条记录
  const queryAnswer = `
      SELECT answerid
      FROM answer
      WHERE appliedid = ${id} AND isSample = 1
      LIMIT 1;
    `;

  connection.query(queryAnswer, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error retrieving answer.");
    } else {
      if (result.length === 0) {
        console.log("Answer not found.");
        res.send([]);
      } else {
        const { answerid } = result[0];
        console.log("answerid=", answerid);
        // 查询与answerid相等的所有记录，并按stepid属性递增排序
        const querySteps = `
          SELECT content
          FROM step
          WHERE answerid = ${answerid}
          ORDER BY stepid ASC;
        `;

        connection.query(querySteps, (error, result) => {
          if (error) {
            console.log(error);
            res.status(500).send("Error retrieving steps.");
          } else {
            const steps = result.map((row) => row.content);
            console.log("steps=", steps);
            res.send(steps);
          }
        });
      }
    }
  });
});

module.exports = router; // 导出路由实例
