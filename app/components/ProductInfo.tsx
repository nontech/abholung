"use client";

import { XCircle } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { Tooltip } from "react-tooltip";
import type { ProductData } from "../../types/common";

interface ProductInfoProps {
  onProductFetched: (product: ProductData) => void;
  url: string;
  onUrlChange: (url: string) => void;
  productError: string;
}

export default function ProductInfo({
  onProductFetched,
  url,
  onUrlChange,
  productError,
}: ProductInfoProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProduct = async (newUrl: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/fetch-product-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newUrl }),
      });
      const data = await response.json();

      if (response.ok) {
        data.url = url;
        onProductFetched(data);
      } else {
        setError(data.error || "Failed to fetch product info");
      }
    } catch (error) {
      setError("Error fetching product");
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const cleanKleinanzeigenUrl = (input: string): string => {
    // Regular expression to extract URL starting with https://
    const urlRegex = /(https:\/\/.+)/;
    const match = input.match(urlRegex);

    return match ? match[0] : input;
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newUrl = cleanKleinanzeigenUrl(e.target.value);
    onUrlChange(newUrl);

    // Simple URL validation using the cleaned URL
    const isValidUrl = (url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    // Check if the URL is a "kleinanzeigen" link
    const isKleinanzeigenUrl = (url: string) => {
      return url.includes("kleinanzeigen");
    };

    // Only check if there's a URL
    if (newUrl) {
      if (!isValidUrl(newUrl) || !isKleinanzeigenUrl(newUrl)) {
        setError("Invalid link - please input a valid Kleinanzeigen URL");
        return;
      }
      fetchProduct(newUrl);
    }
  };

  const clearUrl = () => {
    onUrlChange("");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200 hover:border-emerald-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Kleinanzeigen Product Link
        </h2>
        {/* Help Icon */}
        <div
          className="ml-2 text-gray-500 cursor-pointer"
          data-tooltip-id="product-link-help"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {/* Help Tooltip text */}
        <Tooltip id="product-link-help" place="top" className="z-50">
          <div className="text-sm">
            <p>1. Visit the product page on Kleinanzeigen</p>
            <p>2. On App: Tap Share - Copy Link</p>
            <p>On Website: Copy URL from browser address bar</p>
            <p>3. Paste link into the input field below</p>
          </div>
        </Tooltip>
      </div>

      <div className="relative">
        <input
          type="url"
          value={url}
          onChange={handleUrlChange}
          placeholder="Paste Kleinanzeigen product URL here"
          className={`w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-emerald-500 ${
            url ? "pr-12" : "pr-4"
          }`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent" />
          ) : (
            url && (
              <button
                onClick={clearUrl}
                className="p-1 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all"
                aria-label="Clear input"
              >
                <XCircle className="h-6 w-6" />
              </button>
            )
          )}
        </div>
      </div>

      {(error || productError) && (
        <div className="mt-3 flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg">
          <svg
            className="w-5 h-5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm">{error || productError}</span>
        </div>
      )}
    </div>
  );
}
