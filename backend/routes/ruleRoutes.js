const router = require('express').Router();
const { getRules, createRule, updateRule, deleteRule } = require('../controllers/ruleController');
// const auth = require('../middleware/auth');  // <- use your existing auth middleware
// router.use(auth);

router.get('/', getRules);
router.post('/', createRule);
router.put('/:id', updateRule);
router.delete('/:id', deleteRule);

module.exports = router;
