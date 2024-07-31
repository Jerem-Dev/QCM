const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const { checkToken } = require("../middleware/checkToken");

const qcmRouter = Router();
const prisma = new PrismaClient();

qcmRouter.get("/", checkToken, async (req, res) => {
  try {
    const qcms = await prisma.qCM.findMany({
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
    res.json(qcms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des QCM." });
  }
});

qcmRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  const qcm = await prisma.qCM.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });
  res.json(qcm);
});

qcmRouter.post("/create-qcm", checkToken, async (req, res) => {
  try {
    const { title, questions } = req.body;
    const userId = req.user.userId;

    if (!title || !questions || questions.length === 0) {
      return res
        .status(400)
        .json({ error: "Le titre et les questions sont nécessaires." });
    }

    for (const question of questions) {
      if (!question.options || question.options.length < 2) {
        return res.status(400).json({
          error: "Chaque question doit avoir au moins deux réponses.",
        });
      }
    }

    const qcm = await prisma.qCM.create({
      data: {
        title: title,
        userId: userId,
        questions: {
          create: questions.map((question) => ({
            title: question.title,
            explanation: question.explanation,
            options: {
              create: question.options.map((option) => ({
                text_option: option.text_option,
                correct: option.correct,
              })),
            },
          })),
        },
      },
    });

    res.status(201).json(qcm);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la création du QCM." });
  }
});

qcmRouter.get("/user-progress/:qcmId", checkToken, async (req, res) => {
  try {
    const { qcmId } = req.params;
    const userId = req.user.userId;

    const userAnswers = await prisma.user_answer.findMany({
      where: {
        userId: userId,
        option: {
          question: {
            qcmId: parseInt(qcmId),
          },
        },
      },
      include: {
        option: true,
      },
    });

    if (userAnswers.length === 0) {
      return res.json({ currentQuestionIndex: 0 });
    }

    const answeredQuestionIds = userAnswers.map(
      (answer) => answer.option.questionId
    );
    const nextQuestionIndex = answeredQuestionIds.length;

    res.json({ currentQuestionIndex: nextQuestionIndex });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user progress" });
  }
});

module.exports = qcmRouter;
