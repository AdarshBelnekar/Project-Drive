import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import MainContent from "../components/MainContent";
import API from "../api/api";
import UploadModal from "../components/UploadModel";
import { Bars3Icon } from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("My Drive");
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [breadcrumb, setBreadcrumb] = useState([{ id: null, name: "My Drive" }]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const selectedFolderId = breadcrumb[breadcrumb.length - 1].id;

  /** ✅ Fetch folders on load */
  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const res = await API.get("/folders");
      setFolders(res.data);
    } catch (err) {
      console.error("Error fetching folders:", err);
    }
  };

  /** ✅ Fetch images for selected folder */
  useEffect(() => {
    if (selectedFolderId !== null) {
      fetchImages(selectedFolderId);
    } else {
      setImages([]); // Root: no images
    }
  }, [selectedFolderId]);

  const fetchImages = async (folderId) => {
    try {
      const res = await API.get(`/images/${folderId}`);
      setImages(res.data);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  /** ✅ Create folder */
  const handleCreateFolder = async (folderName) => {
    try {
      const res = await API.post("/folders", {
        name: folderName,
        parentId: selectedFolderId || null,
      });
      setFolders((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error creating folder:", err);
    }
  };

  /** ✅ Navigation */
  const handleFolderClick = (folder) => {
    setBreadcrumb([...breadcrumb, { id: folder._id, name: folder.name }]);
    setSelectedFolder(folder._id);
  };

  const handleBreadcrumbClick = (index) => {
    const newBreadcrumb = breadcrumb.slice(0, index + 1);
    setBreadcrumb(newBreadcrumb);
    setSelectedFolder(newBreadcrumb[newBreadcrumb.length - 1].id);
  };

  /** ✅ Upload */
  const handleOpenUploadModal = () => {
    if (!selectedFolderId) {
      alert("Please select a folder to upload images.");
      return;
    }
    setShowUploadModal(true);
  };

  const handleUploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", file.name);
    formData.append("folderId", selectedFolderId);

    try {
      await API.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchImages(selectedFolderId);
      setShowUploadModal(false);
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* ✅ Sidebar (responsive) */}
      <div
        className={`fixed md:static top-0 left-0 h-full bg-white z-50 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 border-r`}
      >
        <Sidebar
          activeMenuItem={activeMenuItem}
          setActiveMenuItem={setActiveMenuItem}
          onCreateFolder={handleCreateFolder}
          closeSidebar={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* ✅ Main Area */}
      <div className="flex-1 flex flex-col">
        {/* ✅ Header for Mobile */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm">
          <Bars3Icon
            className="h-8 w-8 text-gray-700 cursor-pointer"
            onClick={() => setIsSidebarOpen(true)}
          />
          <h1 className="text-lg font-semibold">My Drive</h1>
        </header>

        {/* ✅ Content */}
        <div className="flex-1 overflow-auto">
          <MainContent
            activeMenuItem={activeMenuItem}
            folders={folders}
            images={images}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onFolderClick={handleFolderClick}
            breadcrumb={breadcrumb}
            onBreadcrumbClick={handleBreadcrumbClick}
            onUploadClick={handleOpenUploadModal}
          />
        </div>
      </div>

      {/* ✅ Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUploadImage}
        />
      )}
    </div>
  );
};

export default Dashboard;
