import { useEffect, useState } from 'react';

/**
 * useDebounce hook
 *
 * Fonction : Retourne la même valeur qu’en entrée MAIS seulement
 * après un certain délai (delay, en ms) d’inactivité.
 *
 * À quoi ça sert ?
 * - Empêche de lancer une opération coûteuse (API, filtre, calcul) à CHAQUE frappe de l’utilisateur.
 * - On attend que la personne arrête d’interagir avant de déclencher l’action.
 * - Typique pour : search input, sliders, filtres, resize.
 *
 * @param value  Valeur à debouncer (tout type)
 * @param delay  Délai en millisecondes (par défaut 500 ms)
 * @returns      Valeur qui ne change qu’après un “pause” de delay ms
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
    // État local pour stocker la version “debouncée” de la valeur.
    // Initialisé avec la valeur initiale reçue.
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        /**
         * À chaque fois que value ou delay change :
         * - On crée un nouveau timeout (setTimeout)
         * - Ce timeout va exécuter setDebouncedValue(value) après `delay` ms
         * → Si la valeur change AVANT la fin du délai, le timeout est supprimé et recommencé.
         * → Le debouncedValue ne se met à jour qu’après (“pause d’inactivité”).
         */
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        /**
         * Fonction de cleanup :
         * - Si value/delay change OU si le composant est démonté,
         *   on annule le timeout en cours (clearTimeout)
         * Cela évite déclencher setDebouncedValue alors que la valeur a changé à nouveau ou que le composant est démonté (= bugs/perte de perf).
         */
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Re-exécute l'effet CHAQUE FOIS que value ou delay change

    // Retourne la valeur debouncée : elle ne change que si le user arrête d’interagir pendant `delay` ms
    return debouncedValue;
}
