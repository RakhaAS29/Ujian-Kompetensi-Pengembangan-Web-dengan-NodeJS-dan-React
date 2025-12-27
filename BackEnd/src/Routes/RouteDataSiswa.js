const express = require('express');
const router = express.Router();

const ControllerDataSiswa = require('../controllers/ControllerDataSiswa');
const { createSiswa, updateSiswa } = require('../middleware/validation');

router.get('/', ControllerDataSiswa.getAll);
router.get('/:id', ControllerDataSiswa.getById);
router.post('/', createSiswa, ControllerDataSiswa.create);
router.put('/:id', updateSiswa, ControllerDataSiswa.update);
router.delete('/:id', ControllerDataSiswa.remove);

module.exports = router;