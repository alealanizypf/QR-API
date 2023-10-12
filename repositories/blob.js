const { azure_storage_key, azure_storage_account_name } = require('../config/index');
const { StorageSharedKeyCredential, BlobServiceClient, BlobSASPermissions, generateBlobSASQueryParameters } = require("@azure/storage-blob");
const storage_account_url = `https://${azure_storage_account_name}.blob.core.windows.net`;

class BlobRepository {

   constructor() {
      this._sharedKeyCredential = new StorageSharedKeyCredential(azure_storage_account_name, azure_storage_key);
      this._blobServiceClient = new BlobServiceClient(
         storage_account_url,
         this._sharedKeyCredential
      );
   }

   async getBlob(container,fileName){
      const containerName = container.toLowerCase();
      const containerClient = this._blobServiceClient.getContainerClient(containerName);
      const blockBlobClient  = await containerClient.getBlockBlobClient(fileName);
      const response = {}
      if(blockBlobClient.exists()){
         response.url = await getBlobSasUri(container,fileName);
         response.tags = [];
         let result = await blockBlobClient.getTags();
         for (const tag in result.tags) {
            response.tags.push({ [tag]: result.tags[tag] })
         }
      }
      return response;
   }

   async getBlobs(containerName) {
      const containerClient = await this._blobServiceClient.getContainerClient(containerName);
      let blobs = [];
      for await (const blob of containerClient.listBlobsFlat()) {
         const blockBlobClient = containerClient.getBlockBlobClient(blob.name);

         const result = await blockBlobClient.getTags();
         const tags = [];
         for (const tag in result.tags) {
            tags.push({ [tag]: result.tags[tag]})
         }

         let blobInserted = {
            name: blob.name,
            updatedAt: blob.properties.createdOn,
            tags: tags,
         }
         blobs.push(blobInserted);
      }
      return blobs;
  }

   async uploadBlob(container,blob,tags){
      const tagsJson = JSON.parse(tags)
      const sharedKeyCredential = new StorageSharedKeyCredential(azure_storage_account_name, azure_storage_key);
      const blobServiceClient = new BlobServiceClient(storage_account_url,sharedKeyCredential);

      const containerName = container.toLowerCase();
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = await containerClient.getBlockBlobClient(blob.originalname)
      await blockBlobClient.uploadData(blob.buffer);
      const response = await blockBlobClient.setTags(tagsJson);
      
      return response
   }

   async updateBlob(container,name,tags){
      console.log("tags",tags)
         const sharedKeyCredential = new StorageSharedKeyCredential(azure_storage_account_name, azure_storage_key);
         const blobServiceClient = new BlobServiceClient(storage_account_url,sharedKeyCredential);
         const containerName = container.toLowerCase();
         const containerClient = blobServiceClient.getContainerClient(containerName);
         const blockBlobClient = await containerClient.getBlockBlobClient(name)
         const response = await blockBlobClient.setTags(tags);
         return response
   }

   async deleteBlob(container,fileName){
      try {
         const containerName = container.toLowerCase();
         const containerClient = this._blobServiceClient.getContainerClient(containerName);
         const response = await containerClient
            .getBlockBlobClient(fileName)
            .delete();
         return response;
      } catch (error) {
         next(error)
      }
   }
}
module.exports = BlobRepository

function getBlobSasUri(container,fileName){
   const sharedKeyCredential = new StorageSharedKeyCredential(azure_storage_account_name, azure_storage_key);
   const blobSas = generateBlobSASQueryParameters(
      {
        containerName: container,
        fileName,
        permissions: BlobSASPermissions.parse("r"),
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + 86400),
      },
      sharedKeyCredential
   );
   console.log("BLOBSAS",blobSas);
   return `https://${azure_storage_account_name}.blob.core.windows.net/${container}/${fileName}?${blobSas}`;
}
