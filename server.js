import express from "express";
import { PrismaClient } from "@prisma/client";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const prisma = new PrismaClient();


app.use(cors());
app.use(bodyParser.json());


app.post("/api/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await prisma.user.create({
      data: { name, email, password },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "User creation failed" });
  }
});


app.get("/api/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});


app.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
});


app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { name, email, password },
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: "Update failed" });
  }
});


app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(400).json({ error: "Delete failed" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
