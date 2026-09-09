"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/axios";
import { decodeId, encodeId } from "@/lib/hash-ids";
import NotulensiNewForm from "@/components/MeetingMinutes/notulensi-new-form";

export default function EditNotulensiPage({ params }) {
    const router = useRouter();
    const resolvedParams = use(params);
    const hashedParams = resolvedParams.id;
    const id = decodeId(hashedParams);

    const [isLoading, setIsLoading] = useState(true);
    const [meeting, setMeeting] = useState(null);

    useEffect(() => {
        if (!id) {
            toast.error("ID rapat tidak valid");
            router.push("/dashboard/notulensi-rapat");
            return;
        }

        const fetchMeeting = async () => {
            try {
                setIsLoading(true);
                const res = await api.get(`/api/meetings/${id}`);
                if (res.data?.success && res.data?.data) {
                    setMeeting(res.data.data);
                } else {
                    toast.error("Data rapat tidak ditemukan");
                    router.push("/dashboard/notulensi-rapat");
                }
            } catch (err) {
                console.error("Gagal fetch data rapat:", err);
                toast.error("Gagal memuat data rapat");
                router.push("/dashboard/notulensi-rapat");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMeeting();
    }, [id, router]);

    const handleBack = () => {
        router.push("/dashboard/notulensi-rapat");
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20 text-sm text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mr-2" />
                Memuat data rapat...
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <NotulensiNewForm meeting={meeting} onBack={handleBack} meetingId={id} />
        </div>
    );
}