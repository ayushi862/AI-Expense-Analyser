
const router = require('express').Router();

const { listCategories } = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, listCategories);

module.exports = router;

