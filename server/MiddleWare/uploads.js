import multer from 'multer';

const storage=multer.diskStorage({
    destination: (req,file,cb)=> (
        cb(null,'uploads/')
    ),
    filename:(req,file,cb) => (
        cb(null,`${Date.now()}-${file.originalname}`)
    )
})
  
const upload=multer({
    storage
    // limits: { fileSize: 10 * 1024 * 1024 }, // מגבלת גודל ל-10 מגה-בייט
});


export default  upload;