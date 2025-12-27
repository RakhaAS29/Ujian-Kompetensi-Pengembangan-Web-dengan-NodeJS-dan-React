const pool = require("../config/db");

const formatDateToDDMMYYYY = (val) => {
  if (!val) return null;
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
    const [y, m, d] = val.split('-');
    return `${d}/${m}/${y}`;
  }
  const dObj = (val instanceof Date) ? val : new Date(val);
  const day = String(dObj.getDate()).padStart(2, '0');
  const month = String(dObj.getMonth() + 1).padStart(2, '0');
  const year = dObj.getFullYear();
  return `${day}/${month}/${year}`;
};

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const [rows] = await pool.execute(
        "SELECT * FROM siswa ORDER BY id DESC"
      );
      const formatted = rows.map(r => ({ ...r, tgl_lahir: formatDateToDDMMYYYY(r.tgl_lahir) }));
      res.json(formatted);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const [rows] = await pool.execute(
        "SELECT * FROM siswa WHERE id = ?",
        [id]
      );

      if (rows.length === 0)
        return res.status(404).json({ message: "Data tidak ditemukan" });

      const row = rows[0];
      row.tgl_lahir = formatDateToDDMMYYYY(row.tgl_lahir);
      res.json(row);
    } catch (err) {
      next(err);
    }
  },

  create: async (req, res, next) => {
    try {
      const { nama, alamat, jurusan, tgl_lahir } = req.body;

      const [result] = await pool.execute(
        "INSERT INTO siswa (nama, alamat, jurusan, tgl_lahir) VALUES (?, ?, ?, ?)",
        [nama, alamat, jurusan, tgl_lahir]
      );

      const [rows] = await pool.execute(
        "SELECT * FROM siswa WHERE id = ?",
        [result.insertId]
      );

      const created = rows[0];
      created.tgl_lahir = formatDateToDDMMYYYY(created.tgl_lahir);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  },

  update: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { nama, alamat, jurusan, tgl_lahir } = req.body;

      const [result] = await pool.execute(
        "UPDATE siswa SET nama=?, alamat=?, jurusan=?, tgl_lahir=? WHERE id=?",
        [nama, alamat, jurusan, tgl_lahir, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }

      res.json({ message: "Data berhasil diupdate" });
    } catch (err) {
      next(err);
    }
  },

  remove: async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10);

      const [result] = await pool.execute(
        "DELETE FROM siswa WHERE id = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Data tidak ditemukan" });
      }

      res.json({ message: "Data berhasil dihapus" });
    } catch (err) {
      next(err);
    }
  },
};
