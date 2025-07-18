const Folder = require("../models/Folder");

exports.createFolder = async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const folder = new Folder({ name, parentId: parentId || null, userId: req.user });
    await folder.save();
    res.json(folder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
