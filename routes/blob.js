var express = require('express');
var router = express.Router();
const multer = require("multer");
const upload = multer();
const jwtCheck = require('../middlewares/jwt');
const { getBlob,getBlobs,uploadBlob,deleteBlob, updateBlob } = require("../controllers/blob")

router.get("/getBlobs/:containerName",jwtCheck,getBlobs);
router.get("/getBlob/:containerName/:fileName",getBlob)
router.post("/create",jwtCheck, upload.single("file"),uploadBlob);
router.put("/update",jwtCheck,updateBlob);
router.delete("/delete",jwtCheck,deleteBlob);

module.exports = router;
