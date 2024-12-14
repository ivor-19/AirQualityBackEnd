const multer = require('multer');
const xlsx = require('xlsx');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
})

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
      const filetypes = /xlsx|xls/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
      
      if (extname && mimetype) {
          return cb(null, true);
      }
      return cb(new Error('Only Excel files are allowed'), false);
  }
}).single('file'); // 'file' is the field name for the file input

module.exports = upload;