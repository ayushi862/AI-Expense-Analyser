
const router = require('express').Router();

const {
    getRules,
    createRule,
    updateRule,
    deleteRule
} = require('../controllers/ruleController');

const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', getRules);
router.post('/', createRule);
router.put('/:id', updateRule);
router.delete('/:id', deleteRule);

module.exports = router;

