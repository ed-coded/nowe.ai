"use client";

import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { getMyPropertyById, deletePropertyMedia } from "@/services/properties/propertyService";
import { uploadPropertyImage } from "@/services/properties/propertyImageService";

export function PropertyMediaManager({ propertyId }: { propertyId: string }) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data: property } = useQuery({
    queryKey: ["agent-property", propertyId],
    queryFn: () => getMyPropertyById(propertyId),
  });

  const media = property?.media ?? [];

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadPropertyImage(propertyId, file);
      }
      queryClient.invalidateQueries({ queryKey: ["agent-property", propertyId] });
      toast.success("Photos uploaded");
    } catch {
      toast.error("Couldn't upload one or more photos");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = async (mediaId: string) => {
    try {
      await deletePropertyMedia(mediaId);
      queryClient.invalidateQueries({ queryKey: ["agent-property", propertyId] });
    } catch {
      toast.error("Couldn't remove photo");
    }
  };

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 space-y-4 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">Photos</h2>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] disabled:opacity-60 transition-colors"
        >
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />}
          {uploading ? "Uploading..." : "Add photos"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {media.length === 0 ? (
        <div className="border border-dashed border-[var(--border)] rounded-xl p-8 text-center">
          <p className="text-xs text-[var(--text-faint)]">No photos yet — add at least one before publishing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {media.map((item) => (
            <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden bg-[var(--surface)] group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.fileUrl} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                aria-label="Remove photo"
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
