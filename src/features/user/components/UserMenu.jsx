// src/features/user/components/UserMenu.jsx
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
// Importez une icône de l'utilisateur (ex: de 'react-icons')

export default function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    // Les liens et les icônes correspondent à ceux de la capture (Favoris, Panier, etc.)
    const menuItems = [
        { label: 'Favoris', icon: '♥' },
        { label: 'Panier', icon: '🛒' },
        { label: 'Commandes', icon: '📄' },
        { label: 'Paramètres', icon: '⚙️' },
    ];

    return (
        <div className="relative">
            <Button onClick={toggleMenu} variant="icon" aria-expanded={isOpen}>
                {/* Icône de l'utilisateur ou du menu hamburger */}
                <span className="text-xl">👤</span>
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-xl rounded-md z-10">
                    <ul className="py-1">
                        {menuItems.map(item => (
                            <li key={item.label} className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                                <span className="mr-3">{item.icon}</span>
                                {item.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}