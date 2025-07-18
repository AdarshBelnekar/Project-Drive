import React from "react";

const files = [
  { name: "Project Proposal.pdf", type: "pdf" },
  { name: "Design.png", type: "image" },
  { name: "Report.docx", type: "doc" },
  { name: "Budget.xlsx", type: "excel" },
];

const FileGrid = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">My Files</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {files.map((file, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded shadow hover:shadow-md transition"
          >
            <div className="text-4xl mb-2">📄</div>
            <div className="text-sm font-medium">{file.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileGrid;
