const Image = require("../models/Image");
const path = require("path");

exports.uploadImage = async (req, res) => {
  try {
    const { name, folderId } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;
    const image = new Image({ name, imageUrl, folderId, userId: req.user });
    await image.save();
    res.json(image);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchImages = async (req, res) => {
  try {
    const { name } = req.query;
    const images = await Image.find({
      userId: req.user,
      name: { $regex: name, $options: "i" }
    });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
