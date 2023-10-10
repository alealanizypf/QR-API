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
      try {
         const containerName = container.toLowerCase();
         const containerClient = this._blobServiceClient.getContainerClient(containerName);
         const response = await containerClient.getBlockBlobClient(fileName).downloadToBuffer()

         return response;
      } catch (error) {
         console.error(error)
      }
   }

   async uploadBlob(container,blob){
      try {
         const sharedKeyCredential = new StorageSharedKeyCredential(azure_storage_account_name, azure_storage_key);
         const blobServiceClient = new BlobServiceClient(storage_account_url,sharedKeyCredential);
   
         const containerName = container.toLowerCase();
         const containerClient = blobServiceClient.getContainerClient(containerName);
         const blockBlobClient = await containerClient.getBlockBlobClient(blob.originalname).uploadData(blob.buffer);
         const sasToken = generateBlobSASQueryParameters({
            containerName: containerName,
            blobName: blob.originalname,
            expiresOn: new Date(new Date().valueOf() + 86400),
            permissions: BlobSASPermissions.parse("racwd")
         }, sharedKeyCredential);
            
         const sasUrl = `${blockBlobClient.url}?${sasToken}`;
            
         return sasUrl;
      } catch (error) {
         console.error(error)
      }
   }

   async deleteBlob(container,fileName){
      try {
         const containerName = container.toLowerCase();
         const containerClient = this._blobServiceClient.getContainerClient(containerName);
         const response = await containerClient
            .getBlockBlobClient(fileName)
            .deleteIfExists()

         return response;
      } catch (error) {
         console.error(error)
      }
   }
}

module.exports = BlobRepository