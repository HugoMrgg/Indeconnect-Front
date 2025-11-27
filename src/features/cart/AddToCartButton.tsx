interface AddToCartButtonProps {
    isAvailable: boolean;
    onClick: () => void;
}

export function AddToCartButton({ isAvailable, onClick }: AddToCartButtonProps) {
    return (
        <button
            className="mt-6 bg-black text-white px-5 py-3 rounded-xl w-full text-lg"
            disabled={!isAvailable}
            onClick={onClick}
        >
            {isAvailable ? "Ajouter au panier" : "Indisponible"}
        </button>
    );
}
