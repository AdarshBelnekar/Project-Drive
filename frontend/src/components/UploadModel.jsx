import React, { useState } from "react";

const UploadModal = ({ onClose, onUpload }) => {
  const [imageName, setImageName] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleUpload = () => {
    if (imageName && imageFile) {
      onUpload(imageName, imageFile);
    }
  };

  return (
    <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Upload Image</h3>
        <input
          type="text"
          placeholder="Image Name"
          value={imageName}
          onChange={(e) => setImageName(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <input
          type="file"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="w-full mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
