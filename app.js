import express from "express";
import userRoutes from "./routes/user.routes.js";
import formRoutes from "./routes/form.routes.js";

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);

app.use("/form", formRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
