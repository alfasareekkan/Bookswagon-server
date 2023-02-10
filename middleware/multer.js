import multer from "multer";
const storage = multer.memoryStorage();

//multer uploader function
const upload = multer();

export default upload;