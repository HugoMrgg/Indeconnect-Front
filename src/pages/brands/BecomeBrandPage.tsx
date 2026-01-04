import React, {useEffect, useMemo, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2, Leaf, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { brandsService } from "@/api/services/brands";
import toast from "react-hot-toast";
import {BecomeBrandPageLayout} from "@/features/brands/BecomeBrandLayout";

type FormState = {
    brandName: string;
    contactName: string;
    email: string;
    website: string;
    message: string;
};

export const BecomeBrandPage: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const contentRef = useRef<HTMLDivElement>(null);

    const [form, setForm] = useState<FormState>({
        brandName: "",
        contactName: "",
        email: "",
        website: "",
        message: "",
    });

    const isValid = useMemo(() => {
        return form.brandName.trim().length >= 2 && form.email.trim().includes("@");
    }, [form.brandName, form.email]);

    const onChange = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((f) => ({ ...f, [key]: e.target.value }));
    };

    const goToBrands = () => {
        // Navigate home and try to scroll to brand section
        navigate("/", { replace: false });
        // Small timeout to allow Home render
        setTimeout(() => {
            document.getElementById("brands-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValid || isSubmitting) return;

        try {
            setIsSubmitting(true);

            await brandsService.request({
                brandName: form.brandName,
                contactName: form.contactName?.trim() ? form.contactName : null,
                email: form.email,
                website: form.website?.trim() ? form.website : null,
                message: form.message?.trim() ? form.message : null,
            });

            setForm({ brandName: "", contactName: "", email: "", website: "", message: "" });

            toast.success(
                "Merci ! Un administrateur va te recontacter pour démarrer la création/modification de ta marque et l’ajout de tes articles."
            );
        } catch (err: any) {
            console.error("BecomeBrandPage request error:", err);

            const msg =
                err?.response?.data?.message ??
                err?.response?.data ??
                err?.message ??
                "Erreur inconnue.";

            toast.error(`Impossible d’envoyer la demande. ${msg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const root = contentRef.current;
        if (!root) return;

        const q = searchQuery.trim().toLowerCase();
        const items = Array.from(root.querySelectorAll<HTMLElement>("[data-searchable]"));

        // reset
        items.forEach((node) => node.classList.remove("search-highlight"));

        if (!q) return;

        items.forEach((node) => {
            const text = (node.innerText || node.textContent || "").toLowerCase();
            if (text.includes(q)) node.classList.add("search-highlight");
        });
    }, [searchQuery]);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
    };

    return (
        <BecomeBrandPageLayout searchQuery={searchQuery} onSearchChange={handleSearchChange}>
            <section className="w-full bg-[#c6b08e]">
                <div className="px-6 py-14 max-w-5xl">
                    <p className="text-xs tracking-widest uppercase text-black/50">IndeConnect • Marques responsables</p>
                    <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-black/90">
                        Devenir une marque
                    </h1>
                    <p className="mt-4 max-w-2xl text-black/70 leading-relaxed">
                        Rejoins la plateforme et rends ta marque visible auprès de clients qui cherchent du sens : éthique, transparence,
                        proximité et qualité.
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={goToBrands}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-black text-white px-5 py-2.5 hover:bg-black/90 transition"
                        >
                            Voir les marques <ArrowRight size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-black/20 bg-white/20 px-5 py-2.5 text-black/90 hover:bg-white/30 transition"
                        >
                            Nous contacter <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </section>
            <div ref={contentRef} className="mx-auto max-w-5xl px-6 py-14">

            {/* Contenu */}
            <section className="px-6 mt-8 max-w-5xl">
                <div className="grid lg:grid-cols-3 gap-4">
                    <div className="rounded-3xl border border-gray-100 bg-white shadow-sm p-6">
                        <div className="flex items-center gap-2 font-medium text-gray-900">
                            <Sparkles size={18} /> Pourquoi nous rejoindre ?
                        </div>
                        <ul className="mt-3 space-y-2 text-sm text-gray-600">
                            <li className="flex gap-2">
                                <Leaf size={16} className="mt-0.5" /> Mise en avant de ta démarche (production & transport).
                            </li>
                            <li className="flex gap-2">
                                <MapPin size={16} className="mt-0.5" /> Visibilité locale via ville / GPS et distance.
                            </li>
                            <li className="flex gap-2">
                                <ShieldCheck size={16} className="mt-0.5" /> Confiance : avis, transparence et critères clairs.
                            </li>
                        </ul>
                    </div>

                    <div className="rounded-3xl border border-gray-100 bg-white shadow-sm p-6 lg:col-span-2">
                        <div className="flex items-center gap-2 font-medium text-gray-900">
                            <Building2 size={18} /> Comment ça marche ?
                        </div>

                        <div className="mt-4 grid sm:grid-cols-3 gap-3">
                            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                                <p className="text-xs text-gray-500">Étape 1</p>
                                <p className="mt-1 font-semibold text-gray-900">Candidature</p>
                                <p className="mt-1 text-sm text-gray-600">Tu nous envoies les infos de ta marque.</p>
                            </div>
                            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                                <p className="text-xs text-gray-500">Étape 2</p>
                                <p className="mt-1 font-semibold text-gray-900">Validation</p>
                                <p className="mt-1 text-sm text-gray-600">On vérifie la cohérence et les critères.</p>
                            </div>
                            <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                                <p className="text-xs text-gray-500">Étape 3</p>
                                <p className="mt-1 font-semibold text-gray-900">Publication</p>
                                <p className="mt-1 text-sm text-gray-600">Ta marque apparaît et les clients te trouvent.</p>
                            </div>
                        </div>

                        <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
                            <p className="text-sm text-gray-700">
                                Objectif : une sélection “qualité” plutôt qu’un annuaire géant. Ici, on préfère 100 marques solides que 10 000
                                copies-collées.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact / Form */}
                <div id="contact" className="mt-6 rounded-3xl border border-gray-100 bg-white shadow-sm p-6">
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight text-gray-900">Déposer une demande</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Version dev : le formulaire log en console. Tu brancheras ton API quand le backend tourne.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={onSubmit} className="mt-4 grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm text-gray-600">Nom de la marque *</label>
                            <input
                                value={form.brandName}
                                onChange={onChange("brandName")}
                                className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                placeholder="Ex: Denim Éthique"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600">Email *</label>
                            <input
                                value={form.email}
                                onChange={onChange("email")}
                                className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                placeholder="contact@marque.com"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600">Nom du contact</label>
                            <input
                                value={form.contactName}
                                onChange={onChange("contactName")}
                                className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                placeholder="Prénom Nom"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600">Site web</label>
                            <input
                                value={form.website}
                                onChange={onChange("website")}
                                className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="text-sm text-gray-600">Message</label>
                            <textarea
                                value={form.message}
                                onChange={onChange("message")}
                                className="mt-1 w-full min-h-28 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                placeholder="Dis-nous ce que vous faites, où vous produisez, vos engagements, etc."
                            />
                        </div>

                        <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                            <button
                                type="submit"
                                disabled={!isValid}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-black text-white px-5 py-2.5
                           disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/90 transition"
                            >
                                Envoyer la demande <ArrowRight size={18} />
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="text-sm text-gray-600 hover:text-gray-900 transition"
                            >
                                Retour à l’accueil
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
        </BecomeBrandPageLayout>
    );
};
