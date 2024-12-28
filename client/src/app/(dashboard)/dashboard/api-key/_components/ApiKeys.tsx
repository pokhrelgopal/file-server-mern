"use client";

import Button from "@/components/ui/button";
import { DocumentCopy } from "iconsax-react";

import { useState } from "react";

// This is sample data - replace with your database data later
const API_KEY = "eyJhcGil*********************************************";

export function ApiKeys() {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`UPLOADTHING_TOKEN=${API_KEY}`);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">API Keys</h1>
        <p className="text-sm text-muted-foreground">
          View and manage your UploadThing API keys.
        </p>
      </div>

      <div className="rounded-lg border border-line-divider bg-card text-card-foreground shadow-sm">
        <div className="p-4">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Quick Copy</h2>
            <p className="text-sm text-muted-foreground">
              Copy your environment variable to your clipboard.
            </p>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="rounded-md bg-black p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">.env.local</span>
                  <Button variant="secondary" onClick={handleCopy} className="">
                    <DocumentCopy className="size-4 stroke-icon-default" />
                    <span className="sr-only">Copy</span>
                  </Button>
                </div>
                <div className="mt-2 font-mono">
                  <span className="text-gray-500">1</span>
                  <span className="ml-4 text-blue-400">DROPIT_TOKEN</span>
                  <span className="text-gray-300">=</span>
                  <span className="text-gray-300">&quot;{API_KEY}&quot;</span>
                </div>
              </div>
              {copySuccess && (
                <div className="absolute right-2 top-2 rounded-md bg-green-500 px-2 py-1 text-xs text-white">
                  Copied!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
