import React from "react";
import { EthicsCategoryDto, EthicsFormDto, EthicsQuestionDto } from "@/api/services/ethics/superVendor/types";

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const highlight = (text: string, query: string) => {
    const q = query.trim();
    if (!q) return text;

    const re = new RegExp(`(${escapeRegExp(q)})`, "ig");
    const parts = text.split(re);

    return (
        <>
            {parts.map((p, i) =>
                re.test(p) ? (
                    <mark key={i} className="rounded px-1 bg-yellow-200 text-gray-900">
                        {p}
                    </mark>
                ) : (
                    <span key={i}>{p}</span>
                )
            )}
        </>
    );
};

const matches = (value: string | undefined | null, q: string) => {
    if (!q.trim()) return true;
    return (value ?? "").toLowerCase().includes(q.trim().toLowerCase());
};

export const filterFormForSearch = (form: EthicsFormDto, q: string): EthicsCategoryDto[] => {
    const query = q.trim();
    if (!query) return form.categories;

    const out: EthicsCategoryDto[] = [];

    for (const c of form.categories) {
        const catMatch = matches(c.label, query) || matches(c.key, query);

        if (catMatch) {
            out.push(c); // cat match => on garde tout
            continue;
        }

        const keptQuestions: EthicsQuestionDto[] = [];

        for (const qu of c.questions) {
            const qMatch =
                matches(qu.label, query) || matches(qu.key, query) || matches(qu.answerType, query);

            const optionMatch = qu.options.some(
                (o) => matches(o.label, query) || matches(o.key, query)
            );

            if (qMatch || optionMatch) {
                keptQuestions.push(qu); // question ou option match => question + toutes options
            }
        }

        if (keptQuestions.length > 0) {
            out.push({ ...c, questions: keptQuestions });
        }
    }

    return out;
};
