import React, { useState, useEffect, useRef } from "react";
import {
  Image as ImageIcon,
  FolderOpen,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  GripVertical,
  RefreshCw,
} from "lucide-react";
import { useMediaLibrary } from "../lib/hooks/useMediaLibrary";

interface MediaPickerProps {
  label: string;
  value?: string; // Single mode URL
  onChange?: (url: string) => void; // Single mode callback
  multiple?: boolean; // Multi mode flag
  values?: string[]; // Multi mode URLs
  onMultipleChange?: (urls: string[]) => void; // Multi mode callback
  aspectRatioLabel?: string;
  description?: string;
  optional?: boolean;
  maxFiles?: number;
}

export function MediaPicker({
  label,
  value = "",
  onChange,
  multiple = false,
  values = [],
  onMultipleChange,
  aspectRatioLabel = "Ratio Free",
  description,
  optional = false,
  maxFiles = 20,
}: MediaPickerProps) {
  const { pick, loading } = useMediaLibrary();
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [singleImageError, setSingleImageError] = useState(false);
  const [singleDimensions, setSingleDimensions] = useState<{ w: number; h: number } | null>(null);

  // Single image metadata
  const isCloudinary = value ? value.includes("res.cloudinary.com") : false;

  // Single URL validation
  useEffect(() => {
    if (multiple || !value) {
      setSingleDimensions(null);
      setSingleImageError(false);
      return;
    }

    const img = new Image();
    img.src = value;
    img.onload = () => {
      setSingleDimensions({ w: img.naturalWidth, h: img.naturalHeight });
      setSingleImageError(false);
    };
    img.onerror = () => {
      setSingleDimensions(null);
      setSingleImageError(true);
    };
  }, [value, multiple]);

  // Handle single pick
  const handleSingleChoose = async () => {
    try {
      const assets = await pick({ multiple: false });
      if (assets && assets.length > 0 && onChange) {
        onChange(assets[0].secure_url);
      }
    } catch (err) {
      console.error("Failed to pick image:", err);
    }
  };

  // Handle multi pick
  const handleMultiChoose = async () => {
    try {
      const assets = await pick({ multiple: true, max_files: maxFiles - values.length });
      if (assets && assets.length > 0 && onMultipleChange) {
        const pickedUrls = assets.map((a) => a.secure_url);
        onMultipleChange([...values, ...pickedUrls].slice(0, maxFiles));
      }
    } catch (err) {
      console.error("Failed to pick images:", err);
    }
  };

  // Drag and Drop State for Multi Mode
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newValues = [...values];
    const draggedItem = newValues[draggedIndex];
    newValues.splice(draggedIndex, 1);
    newValues.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    if (onMultipleChange) {
      onMultipleChange(newValues);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Render Single Image Picker
  if (!multiple) {
    return (
      <div className="portal-field">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.25rem",
          }}
        >
          <label className="portal-field-label" style={{ margin: 0 }}>
            {label}{" "}
            {optional && (
              <span style={{ color: "var(--zinc-500)", fontWeight: 400, fontSize: "11px" }}>
                (Optional)
              </span>
            )}
          </label>
          <span
            style={{
              fontSize: "11px",
              padding: "2px 6px",
              borderRadius: "4px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--zinc-400)",
              fontFamily: "monospace",
            }}
          >
            {aspectRatioLabel}
          </span>
        </div>

        {/* Thumbnail Preview Area */}
        <div
          style={{
            minHeight: "140px",
            border: "1px dashed rgba(255,255,255,0.15)",
            borderRadius: "10px",
            background: "rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            marginBottom: "0.75rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {value && !singleImageError ? (
            <img
              src={value}
              alt={label}
              style={{
                width: "100%",
                height: "100%",
                maxHeight: "260px",
                objectFit: "contain",
                borderRadius: "6px",
              }}
            />
          ) : (
            <div style={{ textAlign: "center", color: "var(--zinc-500)" }}>
              <ImageIcon size={32} style={{ marginBottom: "0.5rem", opacity: 0.5 }} />
              <p style={{ margin: 0, fontSize: "12px" }}>No image selected</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <button
            type="button"
            className="portal-btn-primary"
            onClick={handleSingleChoose}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "12px",
              padding: "0.4rem 0.8rem",
            }}
          >
            <FolderOpen size={14} />
            {value ? "Choose from Media Library" : "Choose Image"}
          </button>

          {value && (
            <>
              <button
                type="button"
                className="portal-btn-secondary"
                onClick={handleSingleChoose}
                disabled={loading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "12px",
                  padding: "0.4rem 0.8rem",
                }}
              >
                <RefreshCw size={14} />
                Replace
              </button>
              <button
                type="button"
                className="portal-btn-secondary"
                onClick={() => onChange && onChange("")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "12px",
                  padding: "0.4rem 0.8rem",
                  color: "#f87171",
                  borderColor: "rgba(248, 113, 113, 0.2)",
                }}
              >
                <Trash2 size={14} />
                Remove
              </button>
            </>
          )}
        </div>

        {/* Advanced Panel */}
        <div style={{ marginTop: "0.75rem" }}>
          <button
            type="button"
            onClick={() => setAdvancedOpen(!advancedOpen)}
            style={{
              background: "none",
              border: "none",
              color: "var(--zinc-400)",
              fontSize: "11px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              padding: 0,
            }}
          >
            {advancedOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            Advanced — Paste Direct URL
          </button>

          {advancedOpen && (
            <div
              style={{
                marginTop: "0.5rem",
                padding: "0.75rem",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "8px",
              }}
            >
              <input
                type="text"
                className="portal-input"
                placeholder="https://res.cloudinary.com/..."
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
                style={{ width: "100%", fontSize: "12px" }}
              />

              {value && (
                <div
                  style={{
                    marginTop: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      background: isCloudinary
                        ? "rgba(101, 163, 13, 0.1)"
                        : "rgba(234, 179, 8, 0.1)",
                      color: isCloudinary ? "oklch(0.65 0.18 145)" : "oklch(0.74 0.137 79)",
                      border: isCloudinary
                        ? "1px solid rgba(101, 163, 13, 0.2)"
                        : "1px solid rgba(234, 179, 8, 0.2)",
                    }}
                  >
                    {isCloudinary ? "Cloudinary ✓" : "External URL"}
                  </span>

                  {singleImageError ? (
                    <span style={{ fontSize: "11px", color: "#f87171", fontWeight: 500 }}>
                      ⚠️ Could not load image from this link.
                    </span>
                  ) : (
                    <span style={{ fontSize: "11px", color: "var(--zinc-400)" }}>
                      ✓ Image loaded successfully
                      {singleDimensions && ` (${singleDimensions.w} × ${singleDimensions.h} px)`}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {description && (
          <p
            style={{
              fontSize: "11px",
              color: "var(--zinc-400)",
              marginTop: "0.35rem",
              marginBottom: 0,
              lineHeight: "1.4",
            }}
          >
            💡 {description}
          </p>
        )}
      </div>
    );
  }

  // Render Multi Image / Gallery Picker
  return (
    <div className="portal-field">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.25rem",
        }}
      >
        <label className="portal-field-label" style={{ margin: 0 }}>
          {label}{" "}
          <span style={{ color: "var(--zinc-500)", fontWeight: 400, fontSize: "11px" }}>
            ({values.length} selected / max {maxFiles})
          </span>
        </label>
        <span
          style={{
            fontSize: "11px",
            padding: "2px 6px",
            borderRadius: "4px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "var(--zinc-400)",
            fontFamily: "monospace",
          }}
        >
          {aspectRatioLabel}
        </span>
      </div>

      {/* Grid of Draggable Thumbnails */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
          gap: "0.75rem",
          padding: "1rem",
          background: "rgba(0,0,0,0.15)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: "10px",
          marginBottom: "0.75rem",
          minHeight: "100px",
        }}
      >
        {values.map((url, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            style={{
              position: "relative",
              aspectRatio: "1",
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              overflow: "hidden",
              cursor: "move",
              opacity: draggedIndex === index ? 0.4 : 1,
              transition: "opacity 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={url}
              alt={`Slide ${index + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23222'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23555' font-size='10'>Error</text></svg>";
              }}
            />

            {/* Drag Handle Overlay */}
            <div
              style={{
                position: "absolute",
                top: "4px",
                left: "4px",
                background: "rgba(0,0,0,0.6)",
                borderRadius: "4px",
                padding: "2px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.7,
              }}
            >
              <GripVertical size={10} style={{ color: "#fff" }} />
            </div>

            {/* Replace Button Overlay */}
            <button
              type="button"
              onClick={async () => {
                try {
                  const assets = await pick({ multiple: false });
                  if (assets && assets.length > 0 && onMultipleChange) {
                    const newValues = [...values];
                    newValues[index] = assets[0].secure_url;
                    onMultipleChange(newValues);
                  }
                } catch (err) {
                  console.error(err);
                }
              }}
              style={{
                position: "absolute",
                bottom: "4px",
                left: "4px",
                right: "4px",
                background: "rgba(0,0,0,0.6)",
                border: "none",
                borderRadius: "4px",
                padding: "2px 0",
                color: "#fff",
                fontSize: "8.5px",
                cursor: "pointer",
                textAlign: "center",
                opacity: 0.8,
              }}
            >
              Replace
            </button>

            {/* Delete/Remove Button */}
            <button
              type="button"
              onClick={() => {
                if (onMultipleChange) {
                  onMultipleChange(values.filter((_, i) => i !== index));
                }
              }}
              style={{
                position: "absolute",
                top: "4px",
                right: "4px",
                background: "rgba(220,38,38,0.85)",
                border: "none",
                borderRadius: "50%",
                width: "16px",
                height: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <X size={10} />
            </button>
          </div>
        ))}

        {values.length < maxFiles && (
          <button
            type="button"
            onClick={handleMultiChoose}
            disabled={loading}
            style={{
              aspectRatio: "1",
              background: "rgba(255,255,255,0.02)",
              border: "1px dashed rgba(255,255,255,0.15)",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--zinc-400)",
              gap: "0.25rem",
              fontSize: "11px",
              padding: 0,
            }}
          >
            <FolderOpen size={16} />
            <span>+ Add Images</span>
          </button>
        )}
      </div>

      {/* Main Buttons */}
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <button
          type="button"
          className="portal-btn-primary"
          onClick={handleMultiChoose}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            fontSize: "12px",
            padding: "0.4rem 0.8rem",
          }}
        >
          <FolderOpen size={14} />
          Choose from Media Library
        </button>
        {values.length > 0 && (
          <button
            type="button"
            className="portal-btn-secondary"
            onClick={() => onMultipleChange && onMultipleChange([])}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "12px",
              padding: "0.4rem 0.8rem",
              color: "#f87171",
              borderColor: "rgba(248, 113, 113, 0.2)",
            }}
          >
            <Trash2 size={14} />
            Clear All
          </button>
        )}
      </div>

      {/* Advanced URL List */}
      <div style={{ marginTop: "0.75rem" }}>
        <button
          type="button"
          onClick={() => setAdvancedOpen(!advancedOpen)}
          style={{
            background: "none",
            border: "none",
            color: "var(--zinc-400)",
            fontSize: "11px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            padding: 0,
          }}
        >
          {advancedOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          Advanced — Paste URLs (one per line)
        </button>

        {advancedOpen && (
          <div
            style={{
              marginTop: "0.5rem",
              padding: "0.75rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "8px",
            }}
          >
            <textarea
              rows={4}
              className="portal-input"
              style={{ resize: "vertical", fontFamily: "monospace", fontSize: "12px" }}
              placeholder={`Paste one URL per line:\nhttps://res.cloudinary.com/.../banner1.jpg`}
              value={values.join("\n")}
              onChange={(e) => {
                const urls = e.target.value
                  .split(/[,\n]/)
                  .map((s) => s.trim())
                  .filter(Boolean);
                if (onMultipleChange) {
                  onMultipleChange(urls.slice(0, maxFiles));
                }
              }}
            />
          </div>
        )}
      </div>

      {description && (
        <p
          style={{
            fontSize: "11px",
            color: "var(--zinc-400)",
            marginTop: "0.35rem",
            marginBottom: 0,
            lineHeight: "1.4",
          }}
        >
          💡 {description}
        </p>
      )}
    </div>
  );
}
