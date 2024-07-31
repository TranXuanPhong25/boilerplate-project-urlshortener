
const generateShortCode = () => {
   // Generate a unique short code for the URL
   const shortCode = Math.random().toString(36).slice(-5);
   return shortCode;
}
const checkDuplicateShortCode = async (shortCode, UrlModel) => {
   // Check if the short code already exists in the database or data store
   const url = await UrlModel.findOne({
      short_url
         : shortCode
   });
   return url ? true : false;
}
const saveUrl = async (originalUrl, shortCode, UrlModel) => {
   // Check if the short code already exists in the database or data store
   const existingUrl = await UrlModel.findOneAndUpdate({ original_url: originalUrl }, { short_url: shortCode }, { upsert:true });
   return existingUrl;
}
const getOriginalUrl = async (shortCode, UrlModel) => {
   // Retrieve the original URL from the database or data store using the short code
   const url = await UrlModel.findOne({ short_url: shortCode },'original_url');
   
   return url ? url.original_url : null;
}
module.exports = { generateShortCode, saveUrl, getOriginalUrl, checkDuplicateShortCode };