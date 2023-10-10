const dotenv = require('dotenv');
dotenv.config();

const azure_storage_key = process.env.AZURE_STORAGE_KEY;
const azure_storage_account_name = process.env.AZURE_STORAGE_ACCOUNT_NAME;

module.exports = {
   azure_storage_account_name,
   azure_storage_key
}