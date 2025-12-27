const checkValid = (body, fields) => {
    for (let field of fields) {
        if (body[field] === undefined || body[field] === "") 
            return field;
        }
    return null;
};

//CREATE
const createSiswa = (req, res, next) => {
  console.log('DEBUG createSiswa headers:', req.headers && req.headers['content-type']);
  console.log('DEBUG createSiswa body (raw):', req.body);
    const missing = checkValid(req.body, [
        'nama', 
        'alamat', 
        'jurusan', 
        'tgl_lahir'
    ]);

    if (missing) {
        return res.status(400).json({
            message: `Field ${missing} is required`
        });
    }
    next();
};

// UPDATE
const updateSiswa = (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    console.log('DEBUG updateSiswa empty body headers:', req.headers && req.headers['content-type']);
    console.log('DEBUG updateSiswa empty body (raw):', req.body);
    return res.status(400).json({
      message: "Minimal 1 kolom harus diisi"
    });
  }
  next();
};

module.exports = {
  createSiswa,
  updateSiswa
}

