"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useDropzone } from "react-dropzone";
import {
  CloseCircle,
  DocumentCode,
  DocumentUpload,
  Image as ImageIcon,
  Video,
} from "iconsax-react";
import Button from "@/components/ui/button";
import { toast } from "sonner";
import { useUploadFileMutation } from "@/libs/features/fileApi";
import Image from "next/image";

interface FilePreview {
  file: File;
  preview: string;
  type: "image" | "video" | "document";
}
interface SuccessResponse {
  message: string;
  fileUrl: string;
  filePath: string;
}
interface ErrorResponse {
  status: number;
  data: {
    error: string;
    details: string;
  };
}
export function UploadModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<FilePreview | null>(
    null
  );
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]; // Only take the first file
    if (!file) return;

    let type: "image" | "video" | "document";
    if (file.type.startsWith("image/")) {
      type = "image";
    } else if (file.type.startsWith("video/")) {
      type = "video";
    } else {
      type = "document";
    }

    setSelectedFile({
      file,
      preview: type === "image" ? URL.createObjectURL(file) : "",
      type,
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("file", selectedFile.file);
      const res: SuccessResponse = await uploadFile(formData).unwrap();
      toast.success(res.message || "Upload successful");
      setSelectedFile(null);
      setIsOpen(false);
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      toast.error(err.data.details || "Upload failed");
    }
  };

  React.useEffect(() => {
    return () => {
      // Cleanup preview URL when component unmounts
      if (selectedFile?.preview) {
        URL.revokeObjectURL(selectedFile.preview);
      }
    };
  }, [selectedFile]);

  const getFileIcon = (type: "image" | "video" | "document") => {
    switch (type) {
      case "image":
        return <ImageIcon className="size-5 stroke-blue-500" />;
      case "video":
        return <Video className="size-5 stroke-purple-500" />;
      default:
        return <DocumentCode className="size-5 stroke-green-500" />;
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="bg-accent-700 text-white px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer">
          <DocumentUpload className="size-5 stroke-white" />
          <span>Upload</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-4 shadow-lg focus:outline-none data-[state=open]:animate-contentShow">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold">
              Upload File
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-500">
                <CloseCircle className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {!selectedFile ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center mb-1 h-40 transition-colors ${
                isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="text-blue-500">Drop the file here...</p>
              ) : (
                <p className="text-gray-500">
                  Drag and drop a file here, or click to select
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getFileIcon(selectedFile.type)}
                  <div>
                    <h4 className="font-medium">{selectedFile.file.name}</h4>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <CloseCircle className="w-5 h-5" />
                </button>
              </div>

              {selectedFile.type === "image" && (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    height={200}
                    width={200}
                    src={(selectedFile.preview as string) || ""}
                    alt="Preview"
                    className="object-contain w-full h-full"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => setSelectedFile(null)}
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  loading={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
