import React, { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Upload, Loader2} from "lucide-react";
import { imagesService } from "@/api/services/image";
import toast from "react-hot-toast";
import { SortableMediaItem } from "./SortableMediaItem";
import { logger } from "@/utils/logger";

interface MediaItem {
    url: string;
    type: "Image" | "Video";
    displayOrder: number;
    isPrimary: boolean;
}

interface ProductMediaManagerProps {
    media: MediaItem[];
    onMediaUpdate: (media: MediaItem[]) => void;
}

export function ProductMediaManager({ media, onMediaUpdate }: ProductMediaManagerProps) {
    const [uploading, setUploading] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = media.findIndex((m) => m.url === active.id);
            const newIndex = media.findIndex((m) => m.url === over.id);

            const reordered = arrayMove(media, oldIndex, newIndex).map((m, idx) => ({
                ...m,
                displayOrder: idx,
            }));

            onMediaUpdate(reordered);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);

        try {
            const cloudinaryUrl = await imagesService.uploadImage(file, {
                maxSizeMB: 10,
                allowedFormats: ["image/jpeg", "image/png", "image/webp"],
            });

            const newMedia: MediaItem = {
                url: cloudinaryUrl,
                type: "Image",
                displayOrder: media.length,
                isPrimary: media.length === 0,
            };

            onMediaUpdate([...media, newMedia]);
            toast.success("Image ajoutée !", { icon: "📸" });
        } catch (err) {
            logger.error("ProductMediaManager.uploadImage", err);
            toast.error("Erreur lors de l'upload de l'image");
        } finally {
            setUploading(false);
        }
    };

    const handleSetPrimary = (url: string) => {
        const updated = media.map((m) => ({
            ...m,
            isPrimary: m.url === url,
        }));
        onMediaUpdate(updated);
    };

    const handleRemove = (url: string) => {
        const filtered = media.filter((m) => m.url !== url);

        // Si on supprime l'image primary et qu'il reste des images, mettre la première en primary
        if (filtered.length > 0 && !filtered.some(m => m.isPrimary)) {
            filtered[0].isPrimary = true;
        }

        const reordered = filtered.map((m, idx) => ({
            ...m,
            displayOrder: idx,
        }));

        onMediaUpdate(reordered);
        toast.success("Image supprimée", { icon: "🗑️" });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Images du produit</h3>
                <span className="text-sm text-gray-600">{media.length} image(s)</span>
            </div>

            <p className="text-sm text-gray-600">
                Glissez-déposez pour réorganiser. L'étoile indique l'image principale.
            </p>

            {/* Zone de drag & drop */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={media.map(m => m.url)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-2 gap-4">
                        {media.map((item) => (
                            <SortableMediaItem
                                key={item.url}
                                item={item}
                                onSetPrimary={() => handleSetPrimary(item.url)}
                                onRemove={() => handleRemove(item.url)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {/* Bouton d'upload */}
            <div className="mt-4">
                <label className="block">
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                    />
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                            uploading
                                ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                                : "border-blue-300 hover:border-blue-500 hover:bg-blue-50"
                        }`}
                    >
                        {uploading ? (
                            <div className="flex flex-col items-center gap-2 text-gray-500">
                                <Loader2 size={32} className="animate-spin" />
                                <span>Upload en cours...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-blue-600">
                                <Upload size={32} />
                                <span className="font-medium">Ajouter une image</span>
                                <span className="text-sm text-gray-500">
                                    JPEG, PNG ou WebP (max 10 MB)
                                </span>
                            </div>
                        )}
                    </div>
                </label>
            </div>
        </div>
    );
}
