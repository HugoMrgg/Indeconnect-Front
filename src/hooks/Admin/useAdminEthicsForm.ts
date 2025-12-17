/*
import { useEffect, useState, useCallback } from "react";
import { ApiError } from "@/api/errors";
import { EthicsFormDto } from "@/api/services/ethics/types";
import { ethicsService } from "@/api/services/ethics";

export function useAdminEthicsForm() {
    const [data, setData] = useState<EthicsFormDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchForm = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const form = await ethicsService.getAdminForm();
            setData(form);
        } catch (e) {
            setError(e instanceof ApiError ? e.message : "Erreur lors du chargement du questionnaire.");
        } finally {
            setLoading(false);
        }
    }, []);

    const saveForm = useCallback(async (payload: EthicsFormDto) => {
        setSaving(true);
        setError(null);
        try {
            const saved = await ethicsService.saveAdminForm(payload);
            setData(saved);
            return true;
        } catch (e) {
            setError(e instanceof ApiError ? e.message : "Erreur lors de l'enregistrement.");
            return false;
        } finally {
            setSaving(false);
        }
    }, []);

    const approve = useCallback(async () => {
        if (!data) return false;
        return await saveForm({ ...data, status: "Approved" });
    }, [data, saveForm]);

    const reject = useCallback(async () => {
        if (!data) return false;
        return await saveForm({ ...data, status: "Rejected" });
    }, [data, saveForm]);

    const backToDraft = useCallback(async () => {
        if (!data) return false;
        return await saveForm({ ...data, status: "Draft" });
    }, [data, saveForm]);

    useEffect(() => {
        fetchForm();
    }, [fetchForm]);

    return {
        data,
        setData,
        loading,
        saving,
        error,
        refetch: fetchForm,
        saveForm,
        approve,
        reject,
        backToDraft,
    };
}
*/
import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/api/errors";

import type {
    AdminCatalogDto,
    AdminUpsertCatalogRequest,
} from "@/api/services/ethics/admin/types";
import {EthicsAdminQuestionnaireService} from "@/api/services/ethics/admin";
export function useAdminEthicsCatalog() {
    const [data, setData] = useState<AdminCatalogDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCatalog = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const catalog = await EthicsAdminQuestionnaireService.getCatalog();
            setData(catalog);
        } catch (e) {
            setError(e instanceof ApiError ? e.message : "Erreur lors du chargement du catalogue admin.");
        } finally {
            setLoading(false);
        }
    }, []);

    const saveCatalog = useCallback(async (payload: AdminUpsertCatalogRequest) => {
        setSaving(true);
        setError(null);
        try {
            const saved = await EthicsAdminQuestionnaireService.saveCatalog(payload);
            setData(saved);
            return true;
        } catch (e) {
            setError(e instanceof ApiError ? e.message : "Erreur lors de l'enregistrement du catalogue admin.");
            return false;
        } finally {
            setSaving(false);
        }
    }, []);

    useEffect(() => {
        fetchCatalog();
    }, [fetchCatalog]);

    return {
        data,
        setData,
        loading,
        saving,
        error,
        refetch: fetchCatalog,
        saveCatalog,
    };
}
