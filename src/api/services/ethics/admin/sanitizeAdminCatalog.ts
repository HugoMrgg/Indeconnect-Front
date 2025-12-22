/*
import { EthicsFormDto } from "./types";

export const normalizeAnswerType = (v: any): "Single" | "Multiple" => {
    if (v === "Single" || v === "Multiple") return v;
    if (v === 0 || v === "0") return "Single";
    if (v === 1 || v === "1") return "Multiple";
    return "Single";
};

export const sanitizeForm = (form: EthicsFormDto): EthicsFormDto => ({
    ...form,
    categories: form.categories.map((c) => ({
        ...c,
        questions: c.questions.map((q) => ({
            ...q,
            answerType: normalizeAnswerType(q.answerType),
        })),
    })),
});
*/




/*import type {
    AdminUpsertCatalogRequest,
    UpsertCategoryDto,
    UpsertQuestionDto,
    UpsertOptionDto,
} from "@/api/services/ethics/types";

const normalizeAnswerType = (v: any): "Single" | "Multiple" => {
    if (v === "Single" || v === "Multiple") return v;
    if (v === 0 || v === "0") return "Single";
    if (v === 1 || v === "1") return "Multiple";
    return "Single";
};

const trim = (v: any) => (typeof v === "string" ? v.trim() : "");
const num = (v: any, fallback = 0) => {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : fallback;
};
const bool = (v: any, fallback = true) => (typeof v === "boolean" ? v : fallback);

export const sanitizeAdminCatalog = (
    catalog: AdminUpsertCatalogRequest
): AdminUpsertCatalogRequest => {
    const Categories: UpsertCategoryDto[] = (catalog?.categories ?? []).map((c) => ({
        ...c,
        Key: trim(c.key),
        Label: trim(c.label),
        Order: num(c.order, 0),
        IsActive: bool(c.isActive, true),
    }));

    const Questions: UpsertQuestionDto[] = (catalog?.questions ?? []).map((q) => ({
        ...q,
        CategoryId: num(q.categoryKey),
        Key: trim(q.key),
        Label: trim(q.label),
        Order: num(q.order, 0),
        AnswerType: normalizeAnswerType(q.answerType),
        IsActive: bool(q.isActive, true),
    }));

    const Options: UpsertOptionDto[] = (catalog?.options ?? []).map((o) => ({
        ...o,
        QuestionId: num(o.questionKey),
        Key: trim(o.key),
        Label: trim(o.label),
        Order: num(o.order, 0),
        Score: num(o.score, 0), // back = decimal, front = number OK
        IsActive: bool(o.isActive, true),
    }));

    return {
        categories: Categories,
        questions: Questions,
        options: Options,
    };
};*/

// ---- Types (tu peux les déplacer où tu veux) ----
export type AdminEthicsCategory = {
    id: number;
    key: string;
    label: string;
    order: number;
    isActive: boolean;
};

export type AdminEthicsQuestion = {
    id: number;
    categoryId: number;
    key: string;
    label: string;
    order: number;
    answerType: number | string; // on garde flexible (enum int ou string)
    isActive: boolean;
};

export type AdminEthicsOption = {
    id: number;
    questionId: number;
    key: string;
    label: string;
    order: number;
    score: number;
    isActive: boolean;
};

export type AdminEthicsCatalog = {
    categories: AdminEthicsCategory[];
    questions: AdminEthicsQuestion[];
    options: AdminEthicsOption[];
};

// ---- Sanitize ----
export function sanitizeAdminCatalog(payload: unknown): AdminEthicsCatalog {
    const root = unwrap(payload);

    // 1) Cas “normal”: { categories, questions, options } (ou sous data/result/value)
    const rawCategories =
        pickFirstArray(root, [
            "categories",
            "ethicsCategories",
            "categoryEntities",
            "category",
            "items",
        ]) ?? [];

    let rawQuestions =
        pickFirstArray(root, ["questions", "ethicsQuestions", "questionEntities"]) ?? [];

    let rawOptions =
        pickFirstArray(root, ["options", "ethicsOptions", "optionEntities"]) ?? [];

    // 2) Cas “imbriqué”: categories -> questions -> options
    //    Si questions/options sont vides, on tente d’aplatir
    if (rawQuestions.length === 0 && Array.isArray(rawCategories)) {
        const nestedQuestions: unknown[] = [];
        const nestedOptions: unknown[] = [];

        for (const c of rawCategories) {
            const co = asObj(c);
            const qs = asArr(co?.questions ?? co?.Questions ?? co?.items ?? []);
            for (const q of qs) {
                nestedQuestions.push(q);
                const qo = asObj(q);
                const ops = asArr(qo?.options ?? qo?.Options ?? qo?.items ?? []);
                for (const o of ops) nestedOptions.push(o);
            }
        }

        if (nestedQuestions.length) rawQuestions = nestedQuestions;
        if (nestedOptions.length) rawOptions = nestedOptions;
    }

    // 3) Normalisation
    const categories: AdminEthicsCategory[] = asArr(rawCategories)
        .map((c) => {
            const o = asObj(c);
            const id = asInt(o?.id ?? o?.Id);
            const label = cleanText(asStr(o?.label ?? o?.Label) ?? "");
            const key = cleanKey(asStr(o?.key ?? o?.Key) ?? labelToKey(label));
            const order = asInt(o?.order ?? o?.Order, 0);
            const isActive = asBool(o?.isActive ?? o?.IsActive, true);

            return { id, key, label, order, isActive };
        })
        .filter((c) => c.id > 0 && c.label.length > 0);

    const questions: AdminEthicsQuestion[] = asArr(rawQuestions)
        .map((q) => {
            const o = asObj(q);
            const id = asInt(o?.id ?? o?.Id);
            const categoryId = asInt(o?.categoryId ?? o?.CategoryId);
            const label = cleanText(asStr(o?.label ?? o?.Label) ?? "");
            const key = cleanKey(asStr(o?.key ?? o?.Key) ?? labelToKey(label));
            const order = asInt(o?.order ?? o?.Order, 0);
            const answerType = (o?.answerType ?? o?.AnswerType) as number | string;
            const isActive = asBool(o?.isActive ?? o?.IsActive, true);

            return { id, categoryId, key, label, order, answerType, isActive };
        })
        .filter((q) => q.id > 0 && q.categoryId > 0 && q.label.length > 0);

    const options: AdminEthicsOption[] = asArr(rawOptions)
        .map((op) => {
            const o = asObj(op);
            const id = asInt(o?.id ?? o?.Id);
            const questionId = asInt(o?.questionId ?? o?.QuestionId);
            const label = cleanText(asStr(o?.label ?? o?.Label) ?? "");
            const key = cleanKey(asStr(o?.key ?? o?.Key) ?? labelToKey(label));
            const order = asInt(o?.order ?? o?.Order, 0);
            const score = asNumber(o?.score ?? o?.Score, 0);
            const isActive = asBool(o?.isActive ?? o?.IsActive, true);

            return { id, questionId, key, label, order, score, isActive };
        })
        .filter((o) => o.id > 0 && o.questionId > 0 && o.label.length > 0);

    // 4) Tri “stable” pour l’UI
    categories.sort((a, b) => a.order - b.order || a.id - b.id);
    questions.sort((a, b) => a.categoryId - b.categoryId || a.order - b.order || a.id - b.id);
    options.sort((a, b) => a.questionId - b.questionId || a.order - b.order || a.id - b.id);

    return { categories, questions, options };
}

// ---- Helpers ----
function unwrap(x: unknown): unknown {
    // Dépile data/result/value tant que ça ressemble à un wrapper d’API
    let cur: unknown = x;
    for (let i = 0; i < 3; i++) {
        const o = asObj(cur);
        if (!o) break;
        if (o.data != null) cur = o.data;
        else if (o.result != null) cur = o.result;
        else if (o.value != null) cur = o.value;
        else break;
    }
    return cur;
}

function pickFirstArray(root: unknown, keys: string[]): unknown[] | null {
    const o = asObj(root);
    if (!o) return null;

    for (const k of keys) {
        const v = (o as any)[k];
        if (Array.isArray(v)) return v;
    }

    // Si on a des propriétés plus “riches” (ex: { categories: { items: [] } })
    for (const k of keys) {
        const v = (o as any)[k];
        const vo = asObj(v);
        const items = vo?.items ?? vo?.Items;
        if (Array.isArray(items)) return items;
    }

    return null;
}

function asObj(x: unknown): Record<string, any> | null {
    return x != null && typeof x === "object" && !Array.isArray(x) ? (x as any) : null;
}

function asArr(x: unknown): unknown[] {
    return Array.isArray(x) ? x : [];
}

function asStr(x: unknown): string | null {
    if (typeof x === "string") return x;
    if (typeof x === "number" || typeof x === "boolean") return String(x);
    return null;
}

function asInt(x: unknown, fallback = 0): number {
    if (typeof x === "number" && Number.isFinite(x)) return Math.trunc(x);
    if (typeof x === "string") {
        const n = Number.parseInt(x, 10);
        return Number.isFinite(n) ? n : fallback;
    }
    return fallback;
}

function asNumber(x: unknown, fallback = 0): number {
    if (typeof x === "number" && Number.isFinite(x)) return x;
    if (typeof x === "string") {
        const n = Number(x);
        return Number.isFinite(n) ? n : fallback;
    }
    return fallback;
}

function asBool(x: unknown, fallback = false): boolean {
    if (typeof x === "boolean") return x;
    if (typeof x === "number") return x !== 0;
    if (typeof x === "string") {
        const v = x.trim().toLowerCase();
        if (["true", "1", "yes", "y"].includes(v)) return true;
        if (["false", "0", "no", "n"].includes(v)) return false;
    }
    return fallback;
}

function cleanText(s: string): string {
    // “pas d’HTML surprise dans l’admin” + trim
    return s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function labelToKey(label: string): string {
    return label
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 80);
}

function cleanKey(key: string): string {
    const k = labelToKey(key);
    return k.length ? k : "key_missing";
}
