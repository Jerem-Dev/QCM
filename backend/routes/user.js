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

module.exports = userRouter;
