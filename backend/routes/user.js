const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const { checkToken } = require("../middleware/checkToken");

const userRouter = Router();

const prisma = new PrismaClient();

userRouter.get("/", checkToken, async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

userRouter.get("/:id", checkToken, async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  res.json(user);
});

userRouter.post("/user-answer", checkToken, async (req, res) => {
  try {
    const { optionIds } = req.body;
    const userId = req.user.userId;

    if (!optionIds || !Array.isArray(optionIds) || optionIds.length === 0) {
      return res.status(400).json({ error: "Option IDs are required" });
    }

    const userAnswers = await prisma.user_answer.createMany({
      data: optionIds.map((optionId) => ({
        userId: userId,
        optionId: optionId,
      })),
    });

    const question = await prisma.option.findUnique({
      where: { id: optionIds[0] },
      select: { questionId: true },
    });

    const options = await prisma.option.findMany({
      where: {
        questionId: question.questionId,
      },
    });

    const correctAnswers = options.filter((option) => option.correct);
    const correctAnswerIds = correctAnswers.map((option) => option.id);

    const isCorrect =
      correctAnswerIds.length === optionIds.length &&
      correctAnswerIds.every((id) => optionIds.includes(id));

    if (isCorrect) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          score: {
            increment: 1,
          },
        },
      });
    }

    res.json({
      message: "Answers submitted successfully",
      correct: isCorrect,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while submitting the answers" });
  }
});

userRouter.get("/calculate-score/:qcmId", checkToken, async (req, res) => {
  try {
    const qcmId = parseInt(req.params.qcmId);
    const userId = req.user.userId;

    const questions = await prisma.question.findMany({
      where: { qcmId: qcmId },
      select: { id: true },
    });

    if (questions.length === 0) {
      return res.status(404).json({ error: "QCM not found" });
    }

    const questionIds = questions.map((question) => question.id);

    const correctOptions = await prisma.option.findMany({
      where: {
        questionId: { in: questionIds },
        correct: true,
      },
      select: { id: true, questionId: true },
    });

    const correctOptionsByQuestion = correctOptions.reduce((acc, option) => {
      if (!acc[option.questionId]) {
        acc[option.questionId] = [];
      }
      acc[option.questionId].push(option.id);
      return acc;
    }, {});

    const userAnswers = await prisma.user_answer.findMany({
      where: {
        userId: userId,
        option: {
          questionId: { in: questionIds },
        },
      },
      select: { optionId: true, option: { select: { questionId: true } } },
    });

    const userAnswersByQuestion = userAnswers.reduce((acc, answer) => {
      const questionId = answer.option.questionId;
      if (!acc[questionId]) {
        acc[questionId] = [];
      }
      acc[questionId].push(answer.optionId);
      return acc;
    }, {});

    let correctAnswersCount = 0;
    for (const questionId of questionIds) {
      const correctOptionIds = correctOptionsByQuestion[questionId] || [];
      const userAnswerIds = userAnswersByQuestion[questionId] || [];

      if (
        correctOptionIds.length === userAnswerIds.length &&
        correctOptionIds.every((id) => userAnswerIds.includes(id))
      ) {
        correctAnswersCount += 1;
      }
    }

    const totalQuestions = questionIds.length;
    const score = `${correctAnswersCount}/${totalQuestions}`;

    res.json({
      message: "Score calculated successfully",
      score: score,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while calculating the score" });
  }
});

module.exports = userRouter;
