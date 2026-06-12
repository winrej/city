import React, { useState } from "react";
import { ZoomIn, Play, Download, X } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

interface MediaItem {
  type: "photo" | "video";
  tab: "exterior" | "amenities" | "interiors";
  src: string;
  thumb: string;
  title: string;
}

interface DocumentItem {
  name: string;
  size: string;
  icon: string;
}

interface MediaSectionProps {
  project: {
    name: string;
  };
  payload: {
    title?: string;
    headline?: string;
    headline_span?: string;
    description?: string;
    media_items: MediaItem[];
    videos?: Array<{ title: string; duration: string; thumb: string }>;
    downloads?: DocumentItem[];
  };
  scrollToForm: () => void;
}

export function MediaSection({ project, payload, scrollToForm }: MediaSectionProps) {
  const [mediaTab, setMediaTab] = useState<
    "exterior" | "amenities" | "interiors" | "videos" | "downloads"
  >("exterior");
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [videoModal, setVideoModal] = useState(false);

  const mediaItems = payload.media_items || [];
  const visibleMedia = mediaItems.filter((m) => m.tab === mediaTab);

  const videos =
    payload.videos ||
    [
      { title: "Project Walkthrough", duration: "3:24", thumb: mediaItems[0]?.thumb || "" },
      { title: "Amenity Tour", duration: "2:08", thumb: mediaItems[1]?.thumb || "" },
      { title: "Virtual Unit Preview", duration: "4:15", thumb: mediaItems[2]?.thumb || "" },
    ].filter((v) => v.thumb);

  const downloads = payload.downloads || [
    { name: "Project Brochure", size: "PDF · 4.2 MB", icon: "📋" },
    { name: "Floor Plans", size: "PDF · 8.5 MB", icon: "📐" },
    { name: "Payment Terms", size: "PDF · 1.1 MB", icon: "💳" },
    { name: "Location Map", size: "PDF · 2.3 MB", icon: "🗺️" },
  ];

  const tabs = [
    { key: "exterior", label: "🏙️ Exterior" },
    { key: "amenities", label: "🌊 Amenities" },
    { key: "interiors", label: "🛋️ Interiors" },
    { key: "videos", label: "▶️ Videos" },
    { key: "downloads", label: "📄 Downloads" },
  ] as const;

  return (
    <section className="px-4 py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Reveal>
            <p className="eyebrow">
              <span className="gold-rule" />
              {payload.title || "Media"}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="display-2 mt-5">
              {payload.headline || "Experience the"}
              <span className="text-primary"> {payload.headline_span || "Property"}</span>
            </h2>
          </Reveal>
          <Reveal delay={180}>
            <p className="text-[15px] text-muted-foreground mt-3">
              {payload.description || "Watch before you visit."}
            </p>
          </Reveal>
        </div>

        {/* Tabs navigation */}
        <Reveal delay={200}>
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setMediaTab(tab.key)}
                className={`px-5 py-2.5 rounded-full text-[12.5px] font-bold tracking-wide transition-all duration-300 cursor-pointer ${
                  mediaTab === tab.key
                    ? "bg-ink text-white shadow-sm"
                    : "bg-surface border border-border/60 text-muted-foreground hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Photo grid */}
        {mediaTab !== "videos" && mediaTab !== "downloads" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {visibleMedia.map((item, i) => (
              <Reveal key={item.src + i} delay={i * 60}>
                <div
                  className={`group relative overflow-hidden rounded-2xl cursor-pointer shadow-soft hover:shadow-lift transition-all duration-500 ${
                    i === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
                  }`}
                  onClick={() => setLightboxImg(item.src)}
                >
                  <img
                    src={item.thumb}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1500ms]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-400 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lift">
                      <ZoomIn size={16} className="text-ink" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-black/60 text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                      {item.title}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {/* Videos tab */}
        {mediaTab === "videos" && (
          <Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {videos.map((vid, i) => (
                <div
                  key={vid.title + i}
                  className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-soft hover:shadow-lift transition-all duration-400"
                  onClick={() => setVideoModal(true)}
                >
                  <img
                    src={vid.thumb}
                    alt={vid.title}
                    className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-[1200ms]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex flex-col items-center justify-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lift">
                      <Play size={22} className="text-ink ml-1" />
                    </div>
                    <p className="text-white font-bold text-[13px]">{vid.title}</p>
                    <p className="text-white/70 text-[11px] font-mono">{vid.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {/* Downloads tab */}
        {mediaTab === "downloads" && (
          <Reveal>
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
              {downloads.map((doc, i) => (
                <button
                  key={doc.name + i}
                  onClick={scrollToForm}
                  className="flex items-center gap-4 bg-surface rounded-2xl px-6 py-4 border border-border/40 hover:border-primary/30 hover:shadow-soft transition-all duration-300 text-left cursor-pointer group"
                >
                  <span className="text-2xl">{doc.icon}</span>
                  <div className="flex-1">
                    <p className="font-bold text-[14px] text-ink group-hover:text-primary transition-colors">
                      {doc.name}
                    </p>
                    <p className="text-[12px] text-muted-foreground mt-0.5">{doc.size}</p>
                  </div>
                  <Download
                    size={16}
                    className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0"
                  />
                </button>
              ))}
              <p className="sm:col-span-2 text-[12.5px] text-muted-foreground text-center mt-2">
                Enter your contact details to unlock free downloads.
              </p>
            </div>
          </Reveal>
        )}

        {/* Lightbox modal */}
        {lightboxImg && (
          <div
            className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setLightboxImg(null)}
          >
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white cursor-pointer"
            >
              <X size={28} />
            </button>
            <img
              src={lightboxImg}
              alt="Property photo"
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* Video modal */}
        {videoModal && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setVideoModal(false)}
          >
            <button
              onClick={() => setVideoModal(false)}
              className="absolute top-6 right-6 text-white/70 hover:text-white cursor-pointer"
            >
              <X size={28} />
            </button>
            <div
              className="bg-black rounded-2xl overflow-hidden max-w-3xl w-full shadow-[0_32px_80px_rgba(0,0,0,0.8)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-video flex items-center justify-center bg-ink/80">
                <div className="text-center text-white/60">
                  <Play size={48} className="mx-auto mb-4 opacity-40" />
                  <p className="text-[14px]">Video walkthrough is loading.</p>
                  <p className="text-[12px] mt-1 opacity-60">
                    Contact us to schedule a live virtual tour.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
