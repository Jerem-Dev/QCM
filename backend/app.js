const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const prisma = new PrismaClient();
const app = express();
app.use(cors());

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

module.exports = app;
