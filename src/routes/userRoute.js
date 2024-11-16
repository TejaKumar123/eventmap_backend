import express from "express";
import { findUser } from "../controllers/userController.js";

const route = express.Router();

route.post("/finduser", findUser);

export default route;