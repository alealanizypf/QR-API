const BlobRepository = require("../repositories/blob")

async function getBlob(req,res,next){
   const blobRepository = new BlobRepository()
   const containerName = req.params.containerName;
   const fileName = req.params.fileName;
   
   try {
      const blob = await blobRepository.getBlob(containerName,fileName);
      if(blob){
         res.status(200).send({ data: blob })
      }
   } catch (error) {
      next(error)      
   }
}

async function getBlobs(req,res) {
   const blobRepository = new BlobRepository();
   const containerName = req.params.containerName;
   const blobs = await blobRepository.getBlobs(containerName)
   res.status(200).send({ data: blobs })
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

async function deleteBlob(req,res){
   const blobRepository = new BlobRepository()
   const { containerName, fileName } = req.body;
   const response = await blobRepository.deleteBlob(containerName,fileName);
   if(response){
      res.status(200).send({message:`se borró el archivo ${fileName}`})
   }
}

module.exports={
   getBlob,
   getBlobs,
   uploadBlob,
   deleteBlob,
}