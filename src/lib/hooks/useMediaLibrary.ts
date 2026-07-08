import { useState } from "react";

export interface PickedAsset {
  secure_url: string;
  width?: number;
  height?: number;
  bytes?: number;
  format?: string;
  created_at?: string;
  public_id?: string;
}

export interface PickOptions {
  multiple?: boolean;
  max_files?: number;
}

let scriptLoadingPromise: Promise<void> | null = null;

function loadCloudinaryScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as any).cloudinary) return Promise.resolve();

  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://media-library.cloudinary.com/global/all.js";
    script.async = true;
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      scriptLoadingPromise = null;
      reject(new Error("Failed to load Cloudinary Media Library script"));
    };
    document.body.appendChild(script);
  });

  return scriptLoadingPromise;
}

export function useMediaLibrary() {
  const [loading, setLoading] = useState(false);

  const pick = (options: PickOptions = {}): Promise<PickedAsset[]> => {
    setLoading(true);
    return loadCloudinaryScript()
      .then(() => {
        return new Promise<PickedAsset[]>((resolve, reject) => {
          const cloudinary = (window as any).cloudinary;
          if (!cloudinary) {
            setLoading(false);
            reject(new Error("Cloudinary script not loaded properly"));
            return;
          }

          let resolved = false;

          const ml = cloudinary.createMediaLibrary(
            {
              cloud_name: "dcnohpztl",
              multiple: options.multiple ?? false,
              max_files: options.max_files ?? 20,
            },
            {
              insertHandler: (data: any) => {
                resolved = true;
                setLoading(false);
                if (data && data.assets) {
                  resolve(
                    data.assets.map((asset: any) => ({
                      secure_url: asset.secure_url || asset.url,
                      width: asset.width,
                      height: asset.height,
                      bytes: asset.bytes,
                      format: asset.format,
                      created_at: asset.created_at,
                      public_id: asset.public_id,
                    })),
                  );
                } else {
                  resolve([]);
                }
              },
              hideHandler: () => {
                setLoading(false);
                if (!resolved) {
                  resolved = true;
                  resolve([]);
                }
              },
            },
          );

          ml.show();
        });
      })
      .catch((err) => {
        setLoading(false);
        throw err;
      });
  };

  return { pick, loading };
}
