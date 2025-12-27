const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// test koneksi database
const pool = require('./config/db');
pool.getConnection()
    .then(() => console.log("Berhasil konek ke database db_DataSiswa"))
    .catch(err => console.error("Gagal koneksi ke database:", err));

app.use(cors());
app.use(express.json());
// parse application/x-www-form-urlencoded (for HTML form submits or some frontends)
app.use(express.urlencoded({ extended: true }));

// ROUTES
const RoutesSim = require('./routes/RouteDataSiswa');
app.use('/api/DataSiswa', RoutesSim);

app.get('/', (req, res) => {
    res.send('Selamat datang di Daftar Siswa');
});

// ERROR HANDLER
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        message: 'Terjadi kesalahan di server',
        error: err.message
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
