import React, { useState } from "react";
import {
  FolderIcon,
  UsersIcon,
  ClockIcon,
  StarIcon,
  TrashIcon,
  CloudIcon,
  PlusIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

const sidebarMenuItems = [
  { name: "My Drive", icon: FolderIcon },
  { name: "Shared with me", icon: UsersIcon },
  { name: "Recent", icon: ClockIcon },
  { name: "Starred", icon: StarIcon },
  { name: "Trash", icon: TrashIcon },
  { name: "Storage", icon: CloudIcon },
];

function Sidebar({ activeMenuItem, setActiveMenuItem, onCreateFolder,closeSidebar }) {
  const [showModal, setShowModal] = useState(false);
  const [folderName, setFolderName] = useState("");

  const handleAddFolder = () => {
    if (folderName.trim()) {
      onCreateFolder(folderName);
      setFolderName("");
      setShowModal(false);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
      {/* Header */}
    <div className="flex justify-between items-center mb-4 md:mb-0">
  <h2 className="text-xl font-semibold text-gray-800">Drive</h2>
  <button
    onClick={closeSidebar}
    className="md:hidden text-gray-500 hover:text-gray-700"
  >
    ✕
  </button>
</div>


       

      {/* Create Folder Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-full shadow-md text-gray-700 hover:bg-gray-50 transition duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2 text-gray-600" />
          New Folder
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav>
        <ul>
          {sidebarMenuItems.map((item) => (
            <li
              key={item.name}
              className={`flex items-center px-4 py-2 rounded-r-full cursor-pointer transition duration-200 mb-1
                ${
                  activeMenuItem === item.name
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              onClick={() => setActiveMenuItem(item.name)}
            >
              <item.icon
                className={`h-5 w-5 mr-3 ${
                  activeMenuItem === item.name ? "text-blue-700" : "text-gray-600"
                }`}
              />
              {item.name}
            </li>
          ))}
        </ul>
      </nav>

      {/* Modal for Folder Creation */}
      {showModal && (
        <div className="fixed  inset-0  bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-black text-white rounded-lg p-6 w-96 shadow-lg ">
            <h3 className="text-lg font-semibold mb-4">Create New Folder</h3>
            <input
              type="text"
              placeholder="Folder Name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded border border-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFolder}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
