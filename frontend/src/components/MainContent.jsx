import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  Squares2X2Icon,
  BellIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";

function MainContent({ activeMenuItem }) {
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [breadcrumb, setBreadcrumb] = useState([{ id: null, name: "My Drive" }]);
  const [file, setFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingImages, setLoadingImages] = useState(false);

  const token = localStorage.getItem("token");
  const selectedFolderId = breadcrumb[breadcrumb.length - 1].id;

  /* ---------------- Fetch Folders (all) ---------------- */
  useEffect(() => {
    fetch("hhttps://project-drive-1rp3.onrender.com/api/folders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setFolders)
      .catch((err) => console.error("Fetch folders error:", err));
  }, [token]);

  /* ---------------- Fetch Images (current folder or root) ---------------- */
  useEffect(() => {
    const url = selectedFolderId
      ? `https://project-drive-1rp3.onrender.com/api/images/folder/${selectedFolderId}`
      : "https://project-drive-1rp3.onrender.com/api/images"; // root-level files

    setLoadingImages(true);
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setImages(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Fetch images error:", err))
      .finally(() => setLoadingImages(false));
  }, [selectedFolderId, token]);

  /* ---------------- Folder navigation ---------------- */
  const handleFolderClick = (folder) => {
    setBreadcrumb((prev) => [...prev, { id: folder._id, name: folder.name }]);
  };

  const handleBreadcrumbClick = (index) => {
    setBreadcrumb((prev) => prev.slice(0, index + 1));
  };

  /* ---------------- Upload image to current folder/root ---------------- */
 const handleUpload = async () => {
  if (!file) return alert("Choose a file to upload");

  const formData = new FormData();
  formData.append("image", file);
  formData.append("name", file.name);
  if (selectedFolderId) {
    formData.append("folderId", selectedFolderId);
  } // ✅ Only add if exists

  try {
    const res = await fetch("https://project-drive-1rp3.onrender.com/api/images", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();
    if (res.ok) {
      setImages((prev) => [...prev, result]);
      setFile(null);
      alert("Image uploaded successfully!");
    } else {
      alert("Upload failed: " + result.message);
    }
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

  /* ---------------- Logout ---------------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // or use navigate if available
  };

  /* ---------------- Filtering ---------------- */
  const currentFolders = folders
    .filter((f) => f.parentId === selectedFolderId)
    .filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ---------------- Small helper UI ---------------- */
  const SkeletonCard = () => (
    <div className="animate-pulse p-4 bg-white border rounded-lg shadow-sm">
      <div className="w-full h-20 bg-gray-200 rounded mb-2" />
      <div className="w-1/2 h-3 bg-gray-200 rounded" />
    </div>
  );

  return (
    <div className="flex h-screen">
      <main className="flex-1 flex flex-col">
        {/* ---------- Header ---------- */}
 
<header className="relative bg-white border-b border-gray-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between">
 
  <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2 w-full md:max-w-lg">
    <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 mr-3" />
    <input
      type="text"
      placeholder="Search folders or files"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="flex-1 bg-transparent outline-none"
    />
  </div>


  <div className="hidden md:flex items-center space-x-4 ml-4">
    <Squares2X2Icon className="h-6 w-6 text-gray-600" />
    <BellIcon className="h-6 w-6 text-gray-600" />
    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Logout
    </button>
  </div>

  <button
    onClick={handleLogout}
    className="md:hidden absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
  >
    Logout
  </button>
</header>


        {/* ---------- Content ---------- */}
        <section className="flex-1 p-4 sm:p-6 bg-gray-50 overflow-y-auto">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-y-1 mb-4 text-xs sm:text-sm text-gray-600">
            {breadcrumb.map((crumb, index) => (
              <span key={index} className="flex items-center">
                <button
                  type="button"
                  onClick={() => handleBreadcrumbClick(index)}
                  className="max-w-[7rem] truncate hover:underline text-left"
                  title={crumb.name}
                >
                  {crumb.name}
                </button>
                {index < breadcrumb.length - 1 && (
                  <span className="mx-1 sm:mx-2 text-gray-400">/</span>
                )}
              </span>
            ))}
          </div>

          {/* Upload */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 items-start sm:items-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="border p-2 rounded w-full sm:w-auto"
            />
            <button
              onClick={handleUpload}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
            >
              Upload
            </button>
          </div>

          {/* Folders */}
          {currentFolders.length > 0 && (
            <div className="mb-6">
              <h4 className="text-gray-700 font-semibold mb-3 text-sm sm:text-base">
                Folders
              </h4>
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
                {currentFolders.map((folder) => (
                  <div
                    key={folder._id}
                    onClick={() => handleFolderClick(folder)}
                    className="flex flex-col items-center p-3 sm:p-4 bg-white border rounded-lg shadow-sm hover:shadow-md cursor-pointer transition"
                  >
                    <FolderIcon className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 mb-2" />
                    <p className="text-xs sm:text-sm text-gray-700 truncate w-full text-center">
                      {folder.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          <h4 className="text-gray-700 font-semibold mb-3 text-sm sm:text-base">
            Files
          </h4>

          {loadingImages ? (
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredImages.length > 0 ? (
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 sm:gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image._id}
                  className="flex flex-col items-center p-3 sm:p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={
                      image.imageUrl.startsWith("http")
                        ? image.imageUrl
                        : `https://project-drive-1rp3.onrender.com${image.imageUrl}`
                    }
                    alt={image.name}
                    className="w-full aspect-video object-cover rounded"
                  />
                  <p className="text-xs sm:text-sm text-gray-700 mt-2 truncate w-full text-center">
                    {image.name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No files found.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default MainContent;
