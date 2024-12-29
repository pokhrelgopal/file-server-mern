"use client";

import Button from "@/components/ui/button";
import {
  useGetSecretKeyQuery,
  useRollSecretKeyMutation,
} from "@/libs/features/keyApi";
import { DocumentCopy, Refresh } from "iconsax-react";
import { useState } from "react";

export function ApiKeys() {
  const [copySuccess, setCopySuccess] = useState(false);
  const { data: key, isLoading } = useGetSecretKeyQuery();
  const [isRolling, setIsRolling] = useState(false);
  const [rollSecretKey] = useRollSecretKeyMutation();
  const API_KEY = key?.secretKey;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`DROPIT_TOKEN=${API_KEY}`);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };
  const handleRollKey = async () => {
    try {
      setIsRolling(true);
      await rollSecretKey();
    } catch (error) {
      console.error("Failed to roll key: ", error);
    } finally {
      setIsRolling(false);
    }
  };
  return (
    <div className="w-full space-y-6">
      <div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">API Keys</h1>
          <p className="text-sm text-muted-foreground">
            View and manage your UploadThing API keys.
          </p>
        </div>
      </div>

      {!isLoading || isRolling ? (
        <div className="rounded-lg border border-line-divider bg-card text-card-foreground shadow-sm">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">Quick Copy</h2>
                <p className="text-sm text-muted-foreground">
                  Copy your environment variable to your clipboard.
                </p>
              </div>
              <Button
                onClick={handleRollKey}
                variant="primary"
                className="mt-4"
              >
                <Refresh className="size-4 stroke-white mr-2" />
                <span>Roll Key</span>
              </Button>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="rounded-md bg-black p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">.env.local</span>
                    <Button
                      variant="secondary"
                      onClick={handleCopy}
                      className=""
                    >
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
      ) : (
        <div className="bg-gray-100 w-full h-48 rounded-xl animate-pulse"></div>
      )}
    </div>
  );
}
