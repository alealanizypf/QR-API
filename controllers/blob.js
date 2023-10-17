const BlobRepository = require("../repositories/blob")

async function getBlob(req,res,next){
   const blobRepository = new BlobRepository()
   const containerName = req.params.containerName;
   const fileName = req.params.fileName;
   
   try {
      const blob = await blobRepository.getBlob(containerName,fileName);
         res.status(200).send({ success: true, data: blob })
   } catch (error) {
      res.status(200).send({ success: false, message: "Video not found" })
   }
}

async function getBlobs(req,res,next) {
   try {
      const blobRepository = new BlobRepository();
      const containerName = req.params.containerName;
      const blobs = await blobRepository.getBlobs(containerName)
      res.status(200).send({ data: blobs })
   } catch (error) {
      next(error)
   }
}

async function uploadBlob(req,res,next){
   try {
      const blobRepository = new BlobRepository()
      const { containerName,tags } = req.body;
      const { originalname,buffer } = req.file;
      const sasToken = await blobRepository.uploadBlob(containerName,{originalname,buffer},tags);
      if(sasToken){
         res.status(200).send({message:"archivo subido"})
      }
   } catch (error) {
      next(error)      
   }
}

async function updateBlob(req,res,next){
   try {
      const blobRepository = new BlobRepository()
      const { name ,containerName,tags } = req.body;
      const sasToken = await blobRepository.updateBlob(containerName,name,tags);
      if(sasToken){
         res.status(200).send({message:"archivo actualizado"})
      }
   } catch (error) {
      next(error)      
   }
}

async function deleteBlob(req,res){
   try {
      const blobRepository = new BlobRepository()
      const { containerName, fileName } = req.body;
      const response = await blobRepository.deleteBlob(containerName,fileName);
      if(response){
         res.status(200).send({message:`se borró el archivo ${fileName}`})
      }
   } catch (error) {
      next(error)      
   }
}

module.exports={
   getBlob,
   getBlobs,
   uploadBlob,
   deleteBlob,
   updateBlob
}