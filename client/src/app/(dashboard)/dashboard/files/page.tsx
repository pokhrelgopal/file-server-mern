"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { useState } from "react";
import { Search } from "./_components/Search";
import { FileTable } from "./_components/FileTable";
import { UploadModal } from "./_components/UploadModal";

export default function FilesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Files</h1>
          <p className="text-gray-500 mt-1">
            These are all of the files that have been uploaded via your
            uploader.
          </p>
        </div>
        <UploadModal />
      </div>
      <Search value={searchQuery} onChange={setSearchQuery} />
      <FileTable searchQuery={debouncedSearch} />
    </div>
  );
}
