const { Router } = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const e = require("express");

const authRouter = Router();

const prisma = new PrismaClient();

authRouter.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const userWithSameUsername = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (userWithSameUsername) {
    return res.status(400).json({ error: "Username already exists" });
  } else {
    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        password: hash,
      },
    });
    res.json(user);
  }
});

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });
  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  res.status(200).json({
    id: user.id,
    username: user.username,
    token: jwt.sign(
      { username: user.username, userId: user.id },
      process.env.JWT_SECRET,
      {
        expiresIn: "12h",
      }
    ),
  });
});

module.exports = authRouter;
