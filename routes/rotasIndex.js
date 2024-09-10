var express = require('express');
var router = express.Router();
var controllerIndex = require('../controller/controllerIndex.js')
/* GET home page. */
router.get('/', controllerIndex.tela_principal);
/* POST home page. */
router.post('/', controllerIndex.tela_principal);

router.get('/sobre', controllerIndex.sobre);

module.exports = router;