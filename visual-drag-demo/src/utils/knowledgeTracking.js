import axios from "axios";
//计算P(L0)
async function calculatePL0(userId, knowledgeId) {
    // 获取该知识点的前置知识点列表preKnowledgeIds
    const response = await axios.get(
        `http://localhost:5000/api/knowledgepr/igsys_applied/pullRelation/knowledge_relation?kids=${knowledgeId}`
    );
    const preKnowledgeIds = response.data.map((item) => item.pre_knowledge_id);
    const preKnowledgeCount = preKnowledgeIds.length;
    let pSum = 0;
    // 获取所有学生对各个前置知识点的知识水平，并按照对前置知识点的知识水平进行排序
    for (var kid of preKnowledgeIds) {
        const res = await axios.get(`http://localhost:5000/api/knowledgepr/igsys_applied/getLevel?id=${kid}`);
        const levelData = res.data;
        levelData.sort(function (a, b) {
            return b.kp_level - a.kp_level;
        }); //实现按kp_level降序排序
        let pos = levelData.findIndex((item) => item.stuid === userId);
        let tmp = 0.59 - (0.54 * (pos - 1)) / 49;
        pSum += tmp;
    }

    // 计算每个前置知识点水平排序的p值，并取平均数

    const pL0 = pSum / preKnowledgeCount;

    return pL0;
}
//计算P(T)
async function calculatePT(appliedid) {
    const res = await axios.get(`http://localhost:3000/api/knowledgepr/igsys_applied/pullApplied/${appliedid}`);
    const difficulty = res.data.difficulty;
    switch (difficulty) {
        case 1:
            return 0.9;
        case 2:
            return 0.85;
        case 3:
            return 0.8;
        case 4:
            return 0.75;
        case 5:
            return 0.7;
        case 6:
            return 0.65;
        case 7:
            return 0.6;
        case 8:
            return 0.55;
        case 9:
            return 0.5;
        case 10:
            return 0.45;
        default:
            return 0;
    }
}
//计算P(G)
//这个函数接受一个题目id作为参数。
async function calculatePG(questionId) {
    const threshold = 3; // 知识水平的阈值
    const res = await axios.get(
        `http://localhost:5000/api/knowledgepr/igsys_applied/helpGuess?id=${questionId}&threshold=${threshold}`
    ); //获取这个题目的总学生数
    const lowLevelAndCorrectCount = res.lowLevelAndCorrectCount;
    const totalStudentCount = res.totalStudentCount;
    const difficulty = res.difficulty;
    //最后根据该题目的difficulty乘上一个权值得到这个题目id最终的p(G)。其中difficulty与p(G)负相关，难度越大，权值越小。
    const weight = 1 - (difficulty - 1) / 9; // 权值，难度越大，权值越小
    const pg = (lowLevelAndCorrectCount / totalStudentCount) * weight;
    return pg;
}
//计算P(S)
async function calculatePS(questionId) {
    // 访问数据库获取题目difficulty
    const res = await axios.get(
        `http://localhost:5000/api/knowledgepr/igsys_applied/helpSlip?id=${questionId}&threshold=${threshold}`
    ); //获取这个题目的总学生数
    const difficulty = res.difficulty;
    const answers = res.answers;
    let knowledgeCount = 0;
    let knowledgeAndWrongCount = 0;

    answers.forEach((answer) => {
        // 只考虑知识水平大于7的答案
        if (answer.klAtThatTime > 7) {
            knowledgeCount++;

            // 统计掌握了知识但回答错误的次数
            if (answer.isCorrect === false) {
                knowledgeAndWrongCount++;
            }
        }
    });
    const weight = 1 - (difficulty - 1) / 9; // 权值，难度越大，权值越小
    const pS = (knowledgeAndWrongCount / knowledgeCount) * weight;

    return pS;
}
// Step 1: 预测学生s答题正确与否的概率
function predictAnswer(s, r) {
    // 计算Initial Learning
    var pLrs = calculatePL0(s, r);

    // 计算Guess和Slip
    var pGr = calculatePG(r);
    var pSr = calculatePS(r);

    // 根据公式（1）计算p(Cis)
    var pCis = pLrs * (1 - pSr) + (1 - pLrs) * pGr;

    return pCis;
}

// Step 2: 记录学生的答题记录
function recordAnswer(s, k, isCorrect) {
    // 记录学生s第k次答题的答案是否正确
    const isCorrect = axios.get(`http://localhost:5000/api/knowledgepr/igsys_applied/isCorrect?stu_id=${s}&times=${k}`);
    return isCorrect;
}

// Step 3: 更新学生掌握知识的概率
function updateLearning(s, r, k, isCorrect) {
    // 获取学生s第k次答题后，掌握知识的概率p(Lk-1)
    // 可以通过访问数据库来获取，此处省略具体实现
    var pLk_1 = 0;
    var pSr = calculatePS(r);
    // 根据公式（2）计算p(Lk)
    var pLk;
    if (isCorrect) {
        pLk = pLk_1 + (1 - pLk_1) * pT;
    } else {
        pLk = pLk_1 - pLk_1 * (1 - pSr);
    }
    axios
        .post(`http://localhost:3000/api/knowledgepr/igsys_applied/pushpLk`, {
            stu_id: s,
            appliedid: r,
            k,
            pLk,
        })
        .then((response) => {
            this.$message.success("pLk已成功提交！");
            console.log("pLk已成功提交！");
            this.showIdListDialog2 = false;
        })
        .catch((error) => {
            console.log(error);
        });
    // 更新学生s第k次答题后，掌握知识的概率p(Lk)
}
