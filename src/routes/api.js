const { Router } = require("express");
const router = Router();
const { v4: uuid } = require("uuid");
const path = require("path");
const fs = require("fs");
const FILE_PATH = path.join(__dirname, "../data", "data.json");

const getTasks = () => {
  const tasks = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(tasks);
};
const saveTasks = (tasks) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2), "utf-8");
};
router.get("/", (req, res) => {
  res.send("salom");
});

//get all tasks
router.get("/", (req, res) => {
  res.status(200).json(getTasks());
});

//add new task
router.post("/", (req, res) => {
  const tasks = getTasks();
  const { title, desc, status } = req.body;
  if (!title || !desc || (status !== "new" && status !== "done")) {
    return res.status(400).json({
      message: "maydon to'ldirishda xatolik ketgan yoki to'liq to'ldirilmagan ",
    });
  }
  if (tasks.find((task) => task.title == title)) {
    return res.status(400).json({ message: "bu nomdagi vazifa mavjud" });
  }
  const newTask = {
    id: uuid(),
    title: title.trim(),
    desc: desc.trim(),
    status,
  };
  tasks.unshift(newTask);
  saveTasks(tasks);
  res.redirect("/");
  res.status(201).json(newTask);
});

//edit task
router.put("/:id", (req, res) => {
  const tasks = getTasks();
  const { title, desc, status } = req.body;
  const task = tasks.find((task) => task.id == req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Vazifa topilmadi" });
  }
  if (!title || !desc || !status) {
    return res.status(400).json({ message: "Qaysidur maydon to'ldirilmadi" });
  }
  if (tasks.find((t) => t.title == title && t.id !== req.params.id)) {
    return res
      .status(400)
      .json({ message: "Bu nomdagi vazifa allaqchon mavjud" });
  }
  task.title = title.trim();
  task.status = status;
  task.desc = desc.trim();
  saveTasks(tasks);
  res.redirect("/");
});

// delete task by id
router.delete("/:id", (req, res) => {
  const tasks = getTasks();
  const task = tasks.find((task) => task.id == req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Vazifa topilmadi" });
  }
  const newBooks = tasks.filter((task) => task.id != req.params.id);
  saveTasks(newBooks);
  res.redirect("/");
});

module.exports = router;
