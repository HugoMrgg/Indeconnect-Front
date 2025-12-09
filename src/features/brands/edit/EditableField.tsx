import React, { useState, useRef, useEffect } from "react";
import { Edit2 } from "lucide-react";

interface EditableFieldProps {
    value: string | null | undefined;
    onChange: (value: string) => void;
    placeholder?: string;
    multiline?: boolean;
    className?: string;
    editMode: boolean;
}

export const EditableField: React.FC<EditableFieldProps> = ({
                                                                value,
                                                                onChange,
                                                                placeholder = "",
                                                                multiline = false,
                                                                className = "",
                                                                editMode
                                                            }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localValue, setLocalValue] = useState(value || "");
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        setLocalValue(value || "");
    }, [value]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleBlur = () => {
        setIsEditing(false);
        onChange(localValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !multiline) {
            setIsEditing(false);
            onChange(localValue);
        }
        if (e.key === "Escape") {
            setIsEditing(false);
            setLocalValue(value || "");
        }
    };

    if (!editMode) {
        return <span className={className}>{value || placeholder}</span>;
    }

    if (isEditing) {
        const Component = multiline ? "textarea" : "input";
        return (
            <Component
                ref={inputRef as any}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={`${className} border-2 border-blue-500 rounded px-2 py-1 outline-none w-full`}
                placeholder={placeholder}
                rows={multiline ? 3 : undefined}
            />
        );
    }

    return (
        <span
            onClick={() => setIsEditing(true)}
            className={`${className} cursor-pointer hover:bg-blue-50 hover:outline hover:outline-2 hover:outline-dashed hover:outline-blue-300 rounded px-2 py-1 transition-all inline-block`}
            title="Cliquer pour modifier"
        >
            {localValue || placeholder}
            <Edit2 size={14} className="inline-block ml-2 text-gray-400" />
        </span>
    );
};
