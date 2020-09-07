const router = require("express").Router();
const { catchErrors } = require("../handlers/errorHandlers");
const messageController = require("../controllers/messageController");

const auth = require("../middlewares/auth");

router.get("/:id", auth, catchErrors(messageController.getUserMessages));
router.post("/", auth, catchErrors(messageController.addMessage));

module.exports = router;
