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
         response.url = blockBlobClient.url;
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
          blobs.push(blob);
      }
      return blobs;
  }

   async uploadBlob(container,blob,tags){
      console.log(typeof tags,tags);
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