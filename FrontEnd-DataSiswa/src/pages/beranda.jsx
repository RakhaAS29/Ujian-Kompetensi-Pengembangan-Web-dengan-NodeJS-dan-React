import axios from "axios";
import { useEffect, useState } from "react";
import { Modal } from "bootstrap";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";

export default function DaftarSiswa() {
    const [siswa, setSiswa] = useState([]);
    const [loading, setLoading] = useState(false);

    // Add form state (for Tambah)
    const [nama, setNama] = useState("");
    const [alamat, setAlamat] = useState("");
    const [jurusan, setjurusan] = useState("");
    const [tgl_lahir, settgl_lahir] = useState("");

    // Edit state
    const [editId, setEditId] = useState(null);
    const [editNama, setEditNama] = useState("");
    const [editAlamat, setEditAlamat] = useState("");
    const [editjurusan, setEditjurusan] = useState("");
    const [edittgl_lahir, setEdittgl_lahir] = useState("");

    const [deleteId, setDeleteId] = useState(null);

    const fetchData = () => {
        setLoading(true);
        axios
            .get("http://localhost:3000/api/DataSiswa")
            .then((response) => {
                setSiswa(response.data);
            })
            .catch(() => {})
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        axios
            .post("http://localhost:3000/api/DataSiswa", {
                nama,
                alamat,
                jurusan: jurusan,
                tgl_lahir: tgl_lahir,
            })
            .then(() => {
                fetchData();
            })
            .catch((err) => {
                // log server error
                console.error("POST /api/DataSiswa error:", err.response?.data || err.message);
            })
            .finally(() => {
                setLoading(false);

                const modalEl = document.getElementById("modalTambah");
                const modalInstance = Modal.getOrCreateInstance(modalEl);
                modalInstance.hide();

                document.body.classList.remove("modal-open");
                document
                    .querySelectorAll(".modal-backdrop")
                    .forEach((bd) => bd.remove());

                setNama("");
                setAlamat("");
                setjurusan("");
                settgl_lahir("");
            });
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        const modal = Modal.getOrCreateInstance(
            document.getElementById("modalDelete")
        );
        modal.show();
    };

    const confirmDelete = () => {
        if (!deleteId) return;

        setLoading(true);

        axios
            .delete(`http://localhost:3000/api/DataSiswa/${deleteId}`)
            .then(() => {
                fetchData();
                const modal = Modal.getInstance(
                    document.getElementById("modalDelete")
                );
                modal.hide();
            })
            .finally(() => {
                setLoading(false);
                setDeleteId(null);
            });
    };

    // Edit handlers
    const handleEditClick = (item) => {
        setEditId(item.id);
        setEditNama(item.nama || "");
        setEditAlamat(item.alamat || "");
        setEditjurusan(item.jurusan || "");
        setEdittgl_lahir(convertToInputDate(item.tgl_lahir || ""));

        const modal = Modal.getOrCreateInstance(
            document.getElementById("modalEdit")
        );
        modal.show();
    };

    const formatDisplayDate = (value) => {
        if (!value) return "";
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
            const [y, m, d] = value.split("-");
            return `${d}/${m}/${y}`;
        }
        const dt = new Date(value);
        if (Number.isNaN(dt.getTime())) return value;
        const dd = String(dt.getDate()).padStart(2, "0");
        const mm = String(dt.getMonth() + 1).padStart(2, "0");
        const yyyy = dt.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    };

    const convertToInputDate = (value) => {
        if (!value) return "";
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
        const dt = new Date(value);
        if (Number.isNaN(dt.getTime())) return "";
        const yyyy = dt.getFullYear();
        const mm = String(dt.getMonth() + 1).padStart(2, "0");
        const dd = String(dt.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editId) return;
        setLoading(true);

        axios
            .put(`http://localhost:3000/api/DataSiswa/${editId}`, {
                nama: editNama,
                alamat: editAlamat,
                jurusan: editjurusan,
                tgl_lahir: edittgl_lahir,
            })
            .then(() => {
                fetchData();
                const modal = Modal.getOrCreateInstance(
                    document.getElementById("modalEdit")
                );
                modal.hide();
            })
            .catch((err) => {
                console.error("PUT /api/DataSiswa/:id error:", err.response?.data || err.message);
            })
            .finally(() => {
                setLoading(false);
                setEditId(null);
                setEditNama("");
                setEditAlamat("");
                setEditjurusan("");
                setEdittgl_lahir("");
                document.body.classList.remove("modal-open");
                document
                    .querySelectorAll(".modal-backdrop")
                    .forEach((bd) => bd.remove());
            });
    };

    return (
        <div className="container mt-4">
            <button
                className="btn btn-primary mb-3"
                data-bs-toggle="modal"
                data-bs-target="#modalTambah"
            >
                Tambah Siswa
            </button>

            <div className="card">
                <div className="card-header">Daftar Siswa</div>
                <div className="card-body">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Kode Siswa</th>
                                <th>Nama Siswa</th>
                                <th>Alamat</th>
                                <th>Jurusan</th>
                                <th>Tanggal Lahir</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={7} align="center">
                                        <div className="spinner-border text-primary"></div>
                                    </td>
                                </tr>
                            )}

                            {siswa.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.kode_siswa}</td>
                                    <td>{item.nama}</td>
                                    <td>{item.alamat}</td>
                                    <td>{item.jurusan}</td>
                                    <td>{item.tgl_lahir}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <FaRegTrashAlt /> Hapus
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-info ms-2"
                                            onClick={() => handleEditClick(item)}
                                        >
                                            <FaEdit /> Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah (Tambah Siswa) */}
            <div
                className="modal fade"
                id="modalTambah"
                tabIndex="-1"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h1 className="modal-title fs-5">Tambah Siswa</h1>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-floating mb-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nama"
                                        value={nama}
                                        onChange={(e) => setNama(e.target.value)}
                                        required
                                    />
                                    <label>Nama Siswa</label>
                                </div>

                                <div className="form-floating mb-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Alamat"
                                        value={alamat}
                                        onChange={(e) => setAlamat(e.target.value)}
                                        required
                                    />
                                    <label>Alamat</label>
                                </div>

                                <div className="form-floating mb-2">
                                    <select
                                        className="form-select"
                                        value={jurusan}
                                        onChange={(e) => setjurusan(e.target.value)}
                                        required
                                    >
                                        <option value="">Pilih Jurusan</option>
                                        <option value="Informatika">Informatika</option>
                                        <option value="Akuntansi">Akuntansi</option>
                                        <option value="Fisika">Fisika</option>
                                        <option value="Bahasa Inggris">Bahasa Inggris</option>
                                        <option value="Matematika">Matematika</option>
                                    </select>
                                    <label>Jurusan</label>
                                </div>

                                <div className="form-floating mb-2">
                                    <input
                                        type="date"
                                        className="form-control"
                                        placeholder="tgl_lahir"
                                        value={tgl_lahir}
                                        onChange={(e) => settgl_lahir(e.target.value)}
                                        required
                                    />
                                    <label>Tanggal Lahir</label>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Tutup
                                </button>
                                <input type="submit" className="btn btn-primary" value="Simpan" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal Edit */}
            <div className="modal fade" id="modalEdit" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleEditSubmit}>
                            <div className="modal-header">
                                <h1 className="modal-title fs-5">Edit Siswa</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-floating mb-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Nama"
                                        value={editNama}
                                        onChange={(e) => setEditNama(e.target.value)}
                                        required
                                    />
                                    <label>Nama Siswa</label>
                                </div>

                                <div className="form-floating mb-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Alamat"
                                        value={editAlamat}
                                        onChange={(e) => setEditAlamat(e.target.value)}
                                        required
                                    />
                                    <label>Alamat</label>
                                </div>

                                <div className="form-floating mb-2">
                                    <select
                                        className="form-select"
                                        value={editjurusan}
                                        onChange={(e) => setEditjurusan(e.target.value)}
                                        required
                                    >
                                        <option value="">Pilih Jurusan</option>
                                        <option value="Informatika">Informatika</option>
                                        <option value="Akuntansi">Akuntansi</option>
                                        <option value="Fisika">Fisika</option>
                                        <option value="Bahasa Inggris">Bahasa Inggris</option>
                                        <option value="Matematika">Matematika</option>
                                    </select>
                                    <label>Jurusan</label>
                                </div>

                                <div className="form-floating mb-2">
                                    <input
                                        type="date"
                                        className="form-control"
                                        placeholder="tgl_lahir"
                                        value={edittgl_lahir}
                                        onChange={(e) => setEdittgl_lahir(e.target.value)}
                                        required
                                    />
                                    <label>Tanggal Lahir</label>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                                <input type="submit" className="btn btn-primary" value="Simpan Perubahan" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal Delete */}
            <div
                className="modal fade"
                id="modalDelete"
                tabIndex="-1"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5">
                                Konfirmasi Hapus
                            </h1>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                            ></button>
                        </div>
                        <div className="modal-body">Yakin ingin menghapus Siswa ini?</div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                            <button className="btn btn-danger" onClick={confirmDelete}>Hapus</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
