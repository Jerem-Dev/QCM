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

module.exports = qcmRouter;
