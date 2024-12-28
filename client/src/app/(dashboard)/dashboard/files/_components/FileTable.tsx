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

interface File {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  url: string;
}

const columnHelper = createColumnHelper<File>();

const onDelete = (id: string) => {
  console.log(`Deleting file with id: ${id}`);
  // Implement actual delete logic here
};

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("uploadedAt", {
    header: "Uploaded",
    cell: (info) => info.getValue().toLocaleDateString(),
    sortingFn: "datetime",
  }),
  columnHelper.accessor("size", {
    header: "Size",
    cell: (info) => `${info.getValue()} bytes`,
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
                window.open(info.row.original.url, "_blank", "noopener")
              }
            >
              Open
            </DropdownMenu.Item>
            <DropdownMenu.Item
              className="px-2 py-1.5 outline-none cursor-pointer hover:bg-gray-100 rounded-sm"
              onClick={() =>
                navigator.clipboard.writeText(info.row.original.url)
              }
            >
              Copy Image URL
            </DropdownMenu.Item>

            <DropdownMenu.Item
              onClick={() => {
                onDelete(info.row.original.id);
              }}
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

const data: File[] = [
  {
    id: "8",
    name: "logo.svg",
    size: 43520,
    uploadedAt: new Date("2024-10-17T10:10:00"),
    url: "uploadthing.com/logo.svg",
  },

  {
    id: "12",
    name: "archive.zip",
    size: 432120,
    uploadedAt: new Date("2024-10-21T12:45:00"),
    url: "uploadthing.com/archive.zip",
  },
  {
    id: "13",
    name: "config.yml",
    size: 10240,
    uploadedAt: new Date("2024-10-22T11:30:00"),
    url: "uploadthing.com/config.yml",
  },
  {
    id: "14",
    name: "favicon.ico",
    size: 1540,
    uploadedAt: new Date("2024-10-23T09:50:00"),
    url: "uploadthing.com/favicon.ico",
  },
  {
    id: "15",
    name: "background.jpg",
    size: 543210,
    uploadedAt: new Date("2024-10-24T17:15:00"),
    url: "uploadthing.com/background.jpg",
  },
];

interface FileTableProps {
  searchQuery: string;
}

export function FileTable({ searchQuery }: FileTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const filteredData = React.useMemo(() => {
    return data.filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const onDelete = (id: string) => {
    console.log(`Deleting file with id: ${id}`);
    // Implement actual delete logic here
  };

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
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
