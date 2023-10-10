const BlobRepository = require("../repositories/blob")

async function getBlob(req,res,next){
   const blobRepository = new BlobRepository()
   const containerName = req.params.containerName;
   const fileName = req.params.fileName;
   
   const blob = await blobRepository.getBlob(containerName,fileName);
   if(blob){
      res.status(200).send(blob)
   }
}

async function uploadBlob(req,res,next){
   const blobRepository = new BlobRepository()
   const { containerName } = req.body;
   const { originalname,buffer } = req.file;
   
   const sasToken = await blobRepository.uploadBlob(containerName,{originalname,buffer});
   if(sasToken){
      res.status(200).send({message:"se subio el archivo"})
   }
}

async function deleteBlob(req,res,next){
   const blobRepository = new BlobRepository()
   const { containerName, fileName } = req.body;
   const response = await blobRepository.getBlob(containerName,fileName);
   if(response){
      res.status(200).send({message:`se borró el archivo ${fileName}`})
   }
}

module.exports={
   getBlob,
   uploadBlob,
   deleteBlob,
}