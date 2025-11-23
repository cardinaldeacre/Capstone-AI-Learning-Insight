const ClassesService = require('../services/ClassesService'); // Import service

exports.createClass = async (req, res) => {
  try {
    const data = req.body;
    // Validasi sederhana (opsional)
    if (!data.name) {
      return res.status(400).json({ message: 'Nama kelas wajib diisi' });
    }
    
    const newClass = await ClassesService.create(data);
    res.status(201).json({ message: 'Kelas berhasil dibuat', data: newClass });
  } catch (error) {
    res.status(500).json({ message: 'Gagal membuat kelas', error: error.message });
  }
};

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await ClassesService.findAll();
    res.status(200).json({ data: classes });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data', error: error.message });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const classData = await ClassesService.findById(id);
    
    if (!classData) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' });
    }
    
    res.status(200).json({ data: classData });
  } catch (error) {
    res.status(500).json({ message: 'Error server', error: error.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    const updated = await ClassesService.update(id, data);
    if (!updated) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' });
    }
    
    res.status(200).json({ message: 'Kelas berhasil diupdate' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal update', error: error.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ClassesService.delete(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Kelas tidak ditemukan' });
    }
    
    res.status(200).json({ message: 'Kelas berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus', error: error.message });
  }
};