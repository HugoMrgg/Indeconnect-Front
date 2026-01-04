import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Star, X, GripVertical } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface MediaItem {
    url: string;
    type: "Image" | "Video";
    displayOrder: number;
    isPrimary: boolean;
}

interface SortableMediaItemProps {
    item: MediaItem;
    onSetPrimary: () => void;
    onRemove: () => void;
}

export function SortableMediaItem({ item, onSetPrimary, onRemove }: SortableMediaItemProps) {
    const { t } = useTranslation();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.url });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative group rounded-lg overflow-hidden border-2 ${
                item.isPrimary ? "border-yellow-400" : "border-gray-200"
            } ${isDragging ? "shadow-2xl z-50" : ""}`}
        >
            {/* Image */}
            <div className="aspect-square bg-gray-100">
                <img
                    src={item.url}
                    alt={`Product media ${item.displayOrder + 1}`}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Overlay avec contrôles */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200">
                {/* Poignée de drag */}
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute top-2 left-2 p-2 bg-white/90 rounded-lg cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <GripVertical size={20} className="text-gray-700" />
                </div>

                {/* Bouton primary */}
                <button
                    onClick={onSetPrimary}
                    className={`absolute top-2 right-2 p-2 rounded-lg transition-all ${
                        item.isPrimary
                            ? "bg-yellow-400 text-white"
                            : "bg-white/90 text-gray-700 opacity-0 group-hover:opacity-100"
                    }`}
                    title={item.isPrimary ? t('components.sortableMedia.primaryImage') : t('components.sortableMedia.setPrimary')}
                >
                    <Star size={20} fill={item.isPrimary ? "white" : "none"} />
                </button>

                {/* Bouton supprimer */}
                <button
                    onClick={onRemove}
                    className="absolute bottom-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    title={t('components.sortableMedia.remove')}
                >
                    <X size={20} />
                </button>
            </div>

            {/* Badge "Principale" visible en permanence */}
            {item.isPrimary && (
                <div className="absolute bottom-2 left-2 px-3 py-1 bg-yellow-400 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <Star size={14} fill="white" />
                    {t('components.sortableMedia.primaryBadge')}
                </div>
            )}
        </div>
    );
}