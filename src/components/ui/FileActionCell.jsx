import React from "react";
import axios from "axios";
import Icon from "@/components/ui/Icon";

/**
 * Reusable cell for file actions.
 * Props:
 * - url: string | null
 * - downloadLabel: string (title attribute)
 * - onUpload?: () => void (optional upload/replace handler)
 * - variant?: "primary" | "success" | "muted" (download button style)
 * - showUpload?: boolean (default true)
 * - hideDownloadIfMissing?: boolean (default false)
 * - exclusive?: boolean (default false) - show only one action: download if available, otherwise upload
 */
const FileActionCell = ({ url, downloadLabel, onUpload, variant = "muted", showUpload = true, hideDownloadIfMissing = false, exclusive = false }) => {
  const isAvailable = Boolean(url && url !== "#");

  const baseBtn = "inline-flex items-center justify-center w-8 h-8 rounded-full";
  const styles = {
    primary: `${baseBtn} bg-slate-100 hover:bg-slate-200`,
    brand: `${baseBtn} bg-blue-600 text-white hover:bg-blue-700`,
    success: `${baseBtn} bg-green-500 text-white hover:bg-green-600`,
    muted: `${baseBtn} bg-slate-100 hover:bg-slate-200`,
    disabled: `${baseBtn} bg-slate-100 opacity-50 cursor-not-allowed pointer-events-none`,
  };

  const handleDirectDownload = async () => {
    if (!isAvailable) return;
    try {
      const response = await axios.get(url, { responseType: "blob" });
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      const inferred = (() => {
        try {
          const u = new URL(url);
          const last = u.pathname.split("/").filter(Boolean).pop();
          return last || "archivo.pdf";
        } catch {
          return "archivo.pdf";
        }
      })();
      link.setAttribute("download", inferred);
      document.body.appendChild(link);
      link.click();
      link.parentNode && link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      // Fallback: attempt normal download navigation
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", "archivo.pdf");
      document.body.appendChild(a);
      a.click();
      a.parentNode && a.parentNode.removeChild(a);
    }
  };

  const renderDownload = (
    <button
      type="button"
      onClick={handleDirectDownload}
      className={isAvailable ? (variant === "success" ? styles.success : styles.primary) : styles.disabled}
      title={downloadLabel}
      disabled={!isAvailable}
    >
      <Icon icon="heroicons-outline:arrow-down-tray" />
    </button>
  );

  const renderUpload = (
    <button
      type="button"
      onClick={onUpload}
      className={styles.brand}
      title="Subir archivo"
    >
      <Icon icon="heroicons-outline:arrow-up-tray" />
    </button>
  );

  if (exclusive) {
    return (
      <div className="flex items-center justify-center gap-2">
        {isAvailable ? renderDownload : renderUpload}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {!(hideDownloadIfMissing && !isAvailable) && renderDownload}
      {showUpload && renderUpload}
    </div>
  );
};

export default FileActionCell;



