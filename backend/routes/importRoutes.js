
const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
    previewImport,
    confirmImport
} = require("../controllers/importController");

const authMiddleware = require("../middleware/authMiddleware");

// CSV file upload configuration
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

// Import Preview API
router.post(
    "/preview",
    authMiddleware,
    upload.single("file"),
    previewImport
);

// Import Confirm API
router.post(
    "/confirm",
    authMiddleware,
    confirmImport
);

module.exports = router;
