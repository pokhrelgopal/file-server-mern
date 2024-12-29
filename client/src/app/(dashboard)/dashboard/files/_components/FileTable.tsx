"use client";
import * as React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  DotsHorizontalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@radix-ui/react-icons";
import {
  useDeleteFileMutation,
  useGetFilesQuery,
} from "@/libs/features/fileApi";
import formatFileSize from "@/utils/format";
import { toast } from "sonner";

interface File {
  id: number;
  actualName: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  createdAt: string;
  onDelete: (id: number) => void;
}

const columnHelper = createColumnHelper<File>();

const columns = [
  columnHelper.accessor("actualName", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("createdAt", {
    header: "Uploaded",
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    sortingFn: "datetime",
  }),
  columnHelper.accessor("fileSize", {
    header: "Size",
    cell: (info) => `${formatFileSize(info.getValue())}`,
  }),
  columnHelper.display({
    id: "actions",
    cell: (info) => (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="p-2 hover:bg-gray-100 rounded-md">
            <DotsHorizontalIcon className="h-4 w-4" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="bg-white rounded-md shadow-lg p-1 min-w-[160px]">
            <DropdownMenu.Item
              className="px-2 py-1.5 outline-none cursor-pointer hover:bg-gray-100 rounded-sm"
              onClick={() =>
                window.open(info.row.original.fileUrl, "_blank", "noopener")
              }
            >
              Open
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="px-2 py-1.5 outline-none cursor-pointer hover:bg-gray-100 rounded-sm"
              onClick={() =>
                navigator.clipboard.writeText(info.row.original.fileUrl)
              }
            >
              Copy Image URL
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={() => info.row.original.onDelete(info.row.original.id)}
              className="px-2 py-1.5 outline-none cursor-pointer hover:bg-gray-100 rounded-sm text-red-600"
            >
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    ),
  }),
];

interface FileTableProps {
  searchQuery: string;
}

const TableSkeleton = () => (
  <div className="border border-gray-200 rounded-md overflow-hidden">
    <div className="bg-gray-50 h-12"></div>
    {[...Array(3)].map((_, index) => (
      <div key={index} className="flex border-t border-gray-200">
        <div className="w-1/4 h-12 bg-gray-100 animate-pulse m-2 rounded"></div>
        <div className="w-1/4 h-12 bg-gray-100 animate-pulse m-2 rounded"></div>
        <div className="w-1/4 h-12 bg-gray-100 animate-pulse m-2 rounded"></div>
        <div className="w-1/4 h-12 bg-gray-100 animate-pulse m-2 rounded"></div>
      </div>
    ))}
  </div>
);

export function FileTable({ searchQuery }: FileTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const {
    data: files,
    error,
    isLoading,
    refetch,
  } = useGetFilesQuery(undefined, { refetchOnFocus: true });
  const [deleteFile] = useDeleteFileMutation();

  const filteredData = React.useMemo(() => {
    if (!files) return [];
    return files.filter((file: File) =>
      file.actualName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [files, searchQuery]);

  const onDelete = React.useCallback(
    async (id: number) => {
      try {
        await deleteFile(id.toString()).unwrap();
        toast.success("File deleted successfully");
        refetch(); // Refetch the files list after successful deletion
      } catch (error) {
        console.error(`Error deleting file with id: ${id}`, error);
        toast.error("Failed to delete file. Please try again.");
      }
    },
    [deleteFile, refetch]
  );

  const tableData = React.useMemo(() => {
    return filteredData.map((file: File) => ({
      ...file,
      onDelete,
    }));
  }, [filteredData, onDelete]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) return <TableSkeleton />;
  if (error) return <div className="text-red-500">Error loading files</div>;
  if (!files || files.length === 0)
    return <div className="text-gray-500">No files found</div>;

  return (
    <div className="border border-gray-200 rounded-md overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left font-medium text-gray-500"
                  onClick={header.column.getToggleSortingHandler()}
                  style={{
                    cursor: header.column.getCanSort() ? "pointer" : "default",
                  }}
                >
                  <div className="flex items-center gap-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getCanSort() && (
                      <span className="inline-flex flex-col">
                        <ArrowUpIcon
                          className={`h-3 w-3 ${
                            header.column.getIsSorted() === "asc"
                              ? "text-gray-700"
                              : "text-gray-300"
                          }`}
                        />
                        <ArrowDownIcon
                          className={`h-3 w-3 ${
                            header.column.getIsSorted() === "desc"
                              ? "text-gray-700"
                              : "text-gray-300"
                          }`}
                        />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t border-gray-200">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-gray-900">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
