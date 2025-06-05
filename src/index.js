const express = require("express");
const path = require("path");
const app = express();
const ROUTE = 7070;
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../", "public")));

const taskRoutes = require("./routes/api");
const mainRouter = require("./routes/main");

app.use("/", mainRouter);
app.use("/api/task", taskRoutes);
app.use((req, res) => {
  res
    .status(404)
    .render("404", { title: "Not found", cssPath: "/styles/404.css" });
});

app.listen(ROUTE, () => {
  console.log("sever run \nport:", ROUTE);
});
