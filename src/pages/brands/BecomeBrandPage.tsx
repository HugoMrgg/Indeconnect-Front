import React, {useEffect, useMemo, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
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
        navigate("/", { replace: false });
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

            toast.success(t('become_brand.contact_form.success_message'));
        } catch (err: any) {
            console.error("BecomeBrandPage request error:", err);

            const msg =
                err?.response?.data?.message ??
                err?.response?.data ??
                err?.message ??
                "Erreur inconnue.";

            toast.error(`${t('become_brand.contact_form.error_message')} ${msg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        const root = contentRef.current;
        if (!root) return;

        const q = searchQuery.trim().toLowerCase();
        const items = Array.from(root.querySelectorAll<HTMLElement>("[data-searchable]"));

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
                    <p className="text-xs tracking-widest uppercase text-black/50">
                        {t('become_brand.hero.subtitle')}
                    </p>
                    <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-black/90">
                        {t('become_brand.hero.title')}
                    </h1>
                    <p className="mt-4 max-w-2xl text-black/70 leading-relaxed">
                        {t('become_brand.hero.description')}
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={goToBrands}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-black text-white px-5 py-2.5 hover:bg-black/90 transition"
                        >
                            {t('become_brand.cta.view_brands')} <ArrowRight size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                            className="inline-flex items-center justify-center gap-2 rounded-full border border-black/20 bg-white/20 px-5 py-2.5 text-black/90 hover:bg-white/30 transition"
                        >
                            {t('become_brand.cta.contact_us')} <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </section>

            <div ref={contentRef} className="mx-auto max-w-5xl px-6 py-14">
                <section className="px-6 mt-8 max-w-5xl">
                    <div className="grid lg:grid-cols-3 gap-4">
                        <div className="rounded-3xl border border-gray-100 bg-white shadow-sm p-6">
                            <div className="flex items-center gap-2 font-medium text-gray-900">
                                <Sparkles size={18} /> {t('become_brand.why_join.title')}
                            </div>
                            <ul className="mt-3 space-y-2 text-sm text-gray-600">
                                <li className="flex gap-2">
                                    <Leaf size={16} className="mt-0.5" /> {t('become_brand.why_join.visibility')}
                                </li>
                                <li className="flex gap-2">
                                    <MapPin size={16} className="mt-0.5" /> {t('become_brand.why_join.local')}
                                </li>
                                <li className="flex gap-2">
                                    <ShieldCheck size={16} className="mt-0.5" /> {t('become_brand.why_join.trust')}
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-3xl border border-gray-100 bg-white shadow-sm p-6 lg:col-span-2">
                            <div className="flex items-center gap-2 font-medium text-gray-900">
                                <Building2 size={18} /> {t('become_brand.how_it_works.title')}
                            </div>

                            <div className="mt-4 grid sm:grid-cols-3 gap-3">
                                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                                    <p className="text-xs text-gray-500">{t('become_brand.how_it_works.step1.label')}</p>
                                    <p className="mt-1 font-semibold text-gray-900">{t('become_brand.how_it_works.step1.title')}</p>
                                    <p className="mt-1 text-sm text-gray-600">{t('become_brand.how_it_works.step1.description')}</p>
                                </div>
                                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                                    <p className="text-xs text-gray-500">{t('become_brand.how_it_works.step2.label')}</p>
                                    <p className="mt-1 font-semibold text-gray-900">{t('become_brand.how_it_works.step2.title')}</p>
                                    <p className="mt-1 text-sm text-gray-600">{t('become_brand.how_it_works.step2.description')}</p>
                                </div>
                                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                                    <p className="text-xs text-gray-500">{t('become_brand.how_it_works.step3.label')}</p>
                                    <p className="mt-1 font-semibold text-gray-900">{t('become_brand.how_it_works.step3.title')}</p>
                                    <p className="mt-1 text-sm text-gray-600">{t('become_brand.how_it_works.step3.description')}</p>
                                </div>
                            </div>

                            <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-4">
                                <p className="text-sm text-gray-700">
                                    {t('become_brand.how_it_works.goal')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div id="contact" className="mt-6 rounded-3xl border border-gray-100 bg-white shadow-sm p-6">
                        <div className="flex items-end justify-between gap-3">
                            <div>
                                <h2 className="text-xl font-semibold tracking-tight text-gray-900">
                                    {t('become_brand.contact_form.title')}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {t('become_brand.contact_form.subtitle')}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={onSubmit} className="mt-4 grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-600">
                                    {t('become_brand.contact_form.brand_name_label')}
                                </label>
                                <input
                                    value={form.brandName}
                                    onChange={onChange("brandName")}
                                    className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                    placeholder={t('become_brand.contact_form.brand_name_placeholder')}
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">
                                    {t('become_brand.contact_form.email_label')}
                                </label>
                                <input
                                    value={form.email}
                                    onChange={onChange("email")}
                                    className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                    placeholder={t('become_brand.contact_form.email_placeholder')}
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">
                                    {t('become_brand.contact_form.contact_name_label')}
                                </label>
                                <input
                                    value={form.contactName}
                                    onChange={onChange("contactName")}
                                    className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                    placeholder={t('become_brand.contact_form.contact_name_placeholder')}
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">
                                    {t('become_brand.contact_form.website_label')}
                                </label>
                                <input
                                    value={form.website}
                                    onChange={onChange("website")}
                                    className="mt-1 w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                    placeholder={t('become_brand.contact_form.website_placeholder')}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="text-sm text-gray-600">
                                    {t('become_brand.contact_form.message_label')}
                                </label>
                                <textarea
                                    value={form.message}
                                    onChange={onChange("message")}
                                    className="mt-1 w-full min-h-28 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/10"
                                    placeholder={t('become_brand.contact_form.message_placeholder')}
                                />
                            </div>

                            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                                <button
                                    type="submit"
                                    disabled={!isValid}
                                    className="inline-flex items-center justify-center gap-2 rounded-full bg-black text-white px-5 py-2.5
                           disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/90 transition"
                                >
                                    {t('become_brand.contact_form.submit_button')} <ArrowRight size={18} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate("/")}
                                    className="text-sm text-gray-600 hover:text-gray-900 transition"
                                >
                                    {t('become_brand.contact_form.back_home')}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </BecomeBrandPageLayout>
    );
};