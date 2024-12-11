import express from "express";
import userController from "../controllers/userController.js";

const route = express.Router();

route.post("/finduser", userController.findUser);
route.post("/deleteUser", userController.deleteUser);

export default route;