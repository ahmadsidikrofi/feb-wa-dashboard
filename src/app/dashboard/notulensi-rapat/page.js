"use client";

import TableMeetingMinutes from "@/components/MeetingMinutes/table-meeting-minutes";
import { useRouter } from "next/navigation";
import { encodeId } from "@/lib/hash-ids";

export default function NotulensiRapatPage() {
    const router = useRouter();

    const handleAdd = () => {
        router.push("/dashboard/notulensi-rapat/create");
    };

    const handleEdit = (meeting) => {
        const id = typeof meeting === "object" ? meeting.id : meeting;
        router.push(`/dashboard/notulensi-rapat/${encodeId(id)}/edit`);
    };

    return (
        <div className="space-y-6">
            <TableMeetingMinutes onAdd={handleAdd} onEdit={handleEdit} />
        </div>
    );
}
