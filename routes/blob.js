var express = require('express');
var router = express.Router();
const multer = require("multer");
const upload = multer();
const { getBlob,getBlobs,uploadBlob,deleteBlob, updateBlob } = require("../controllers/blob")

router.get("/getBlobs/:containerName",getBlobs);
router.get("/getBlob/:containerName/:fileName",getBlob)
router.post("/create", upload.single("file"),uploadBlob);
router.put("/update",updateBlob);
router.delete("/delete",deleteBlob);

module.exports = router;
