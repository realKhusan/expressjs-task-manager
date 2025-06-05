const { Router } = require("express");
const router = Router();
const fs = require("fs");
const path = require("path");
const FILE_PATH = path.join(__dirname, "../data", "data.json");

const getTasks = () => {
  const tasks = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(tasks);
};

router.get("/", (req, res) => {
  const tasks = getTasks();
  res.render("main", {
    title: "Main page",
    tasks,
    cssPath: "styles/main.css",
  });
});
router.get("/add", (req, res) => {
  res.render("add", { title: "Add new task", cssPath: "/styles/form.css" });
});
router.get("/edit/:id", (req, res) => {
  const tasks = getTasks();
  const task = tasks.find((b) => b.id === req.params.id);

  if (!task) {
    return res
      .status(404)
      .render("404", { title: "Not found", cssPath: "/styles/404.css" });
  }

  res.render("edit", {
    title: "Edit Task",
    cssPath: "/styles/form.css",
    task,
  });
});

module.exports = router;
