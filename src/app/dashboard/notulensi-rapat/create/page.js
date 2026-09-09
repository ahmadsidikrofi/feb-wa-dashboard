"use client";

import NotulensiNewForm from "@/components/MeetingMinutes/notulensi-new-form";
import { useRouter } from "next/navigation";

export default function CreateNotulensiPage() {
    const router = useRouter();

    const handleBack = () => {
        router.push("/dashboard/notulensi-rapat");
    };

    return (
        <div className="space-y-6">
            <NotulensiNewForm onBack={handleBack} />
        </div>
    );
}
