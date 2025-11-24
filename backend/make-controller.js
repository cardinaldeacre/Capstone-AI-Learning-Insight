const fs = require('fs');
const path = require('path');

// ambil nama controller dari argumen terminal
const name = process.argv[2];
if (!name) {
	console.error('Namanya jangan lupa!');
	process.exit(1);
}

// pastikan folder controllers ada
const controllersDir = path.join(__dirname, 'controllers');
if (!fs.existsSync(controllersDir)) {
	fs.mkdirSync(controllersDir);
}

// nama controller
const fileName = `${name}Controller.js`;
const filePath = path.join(controllersDir, fileName);

// template isi controller
const template = `
const express = require('express');
const router = express.Router();
router.get('/', async (req, res) => {
    try {
      return res.status(200).json();
    } catch (error) {
      console.error(error);
      return res.status(500).json({message: 'Error server'});
    }
});

router.post('/', async (req, res) => {
    try {
      res.status(201).json({message: ''});
    } catch (error) {
      if (error.code === '23505') return res.status(409).json({message: ''});
  
      console.error(error);
      res.status(500).json({message: 'Error server'});
    }
});

router.put('/:id', async (req, res) => {
  const {id} = req.params;
	const updatedData = req.body;

  if (Object.keys(updatedData).length === 0) {
    return res.status(400).json({message: 'Data yang akan diupdate tidak boleh kosong'});
  }

  try {
    const payload = {};
    const itemId = parseInt(id);

    const updateItem = await Service.update(itemId, payload);

    if (!updateItem) {
      return res.status(404).json({message: 'Item tidak ditemukan'});
    }

    res.status(200).json({message: 'Item berhasil diedit', item: updateItem});
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({message: 'item sudah digunakan.'});
    }

    console.error(error);
    res.status(500).json({message: 'Server error'});
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const itemId = parseInt(id);

    if (isNaN(itemId)) {
      return res.status(400).json({message: 'ID item tidak valid'});
    }

    const deletedCount = await Service.delete(itemId);

    if (deletedCount === 0) {
      return res.status(404).json({message: 'Item tidak ditemukan'});
    }
      
    return res.status(200).json({message: 'Item berhasil dihapus'});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Server error'});
  }
});

module.exports = router;
`;

// cek kalo file udah ada
if (fs.existsSync(filePath)) {
	console.error(`Udah dipake namanya, Ganti!`);
	process.exit(1);
}

// tulis file baru
fs.writeFileSync(filePath, template.trim());
console.log(`${fileName} Controller berhasil dibuat`);
