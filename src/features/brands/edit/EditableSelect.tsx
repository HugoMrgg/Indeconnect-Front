import React from "react";

interface EditableSelectProps {
    value: string | null | undefined;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    editMode: boolean;
    className?: string;
}

export const EditableSelect: React.FC<EditableSelectProps> = ({
                                                                  value,
                                                                  onChange,
                                                                  options,
                                                                  placeholder = "",
                                                                  editMode,
                                                                  className = ""
                                                              }) => {
    if (!editMode) {
        const selectedOption = options.find(opt => opt.value === value);
        return (
            <span className={className}>
                {selectedOption?.label || value || placeholder}
            </span>
        );
    }

    return (
        <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className={`${className} px-3 py-2 border border-gray-300 rounded hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition`}
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};
