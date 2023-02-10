import streamifier from "streamifier"
import cloudinary from "./cloudinary.js"
import concat from "concat-stream";

//file upload to cloudinary

export default function uploadFile(file) {
    return new Promise((resolve, reject) => {
    const fileStream = streamifier.createReadStream(file);
    fileStream.pipe(concat((buffer) => {
        cloudinary.uploader.upload_stream({}, (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result)
        }).end(buffer);
      }));
    })
}