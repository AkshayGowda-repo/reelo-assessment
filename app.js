import express from "express";
const app = express();
import questions from "./questions.js";

app.use(express.json());

function generateQuestionPaper(totalMarks, difficultyDistribution) {
  let paper = [];
  let marksCount = { Easy: 0, Medium: 0, Hard: 0 };

  const addQuestions = (difficulty, marksNeeded) => {
    const filteredQuestions = questions.filter(
      (q) => q.difficulty === difficulty
    );
    for (let question of filteredQuestions) {
      if (marksCount[difficulty] + question.marks <= marksNeeded) {
        paper.push(question);
        marksCount[difficulty] += question.marks;
      }
    }
  };

  for (let [difficulty, percentage] of Object.entries(difficultyDistribution)) {
    const marksNeeded = totalMarks * (percentage / 100);
    addQuestions(difficulty, marksNeeded);
  }

  return paper;
}

app.post("/generate-paper", (req, res) => {
  //Example for Request Body
  // {
  //   "totalMarks":"100",
  //   "difficultyDistribution":{ "Easy": 20, "Medium": 50, "Hard": 30 }
  // }

  const { totalMarks, difficultyDistribution } = req.body;
  const questionPaper = generateQuestionPaper(
    totalMarks,
    difficultyDistribution
  );
  res.json(questionPaper);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server up & running on port ${PORT}`));
