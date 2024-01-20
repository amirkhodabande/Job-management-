const express = require('express');
const router = express.Router();

const {index, show, store, update, destroy} = require('../controllers/job-controller');

router.get('/', index);
router.get('/:jobId', show);
router.post('/', store);
router.put('/:jobId', update);
router.delete('/:jobId', destroy);

module.exports = router;