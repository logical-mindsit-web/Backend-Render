import { Router } from "express";
import { singleFiveModeApi,getModeRobotId} from "../Controllers/historyController.js"

const router = Router();
//save history
router.post("/historys/save", singleFiveModeApi);

//get history
router.get("/historys/get", getModeRobotId);


export default router;
