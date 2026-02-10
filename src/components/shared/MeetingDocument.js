// src/components/common/MeetingDocument.jsx
import React, { forwardRef } from 'react';

const MeetingDocument = forwardRef(({ data }, ref) => {
    if (!data) return null;

    // Helper untuk format tanggal (karena di mappedData formatnya sudah string/date object)
    const formatDate = (dateInput) => {
        if (!dateInput) return "-";
        return new Date(dateInput).toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        // Style A4 dengan Tailwind
        <div ref={ref} className="p-12 text-black bg-white max-w-[210mm] mx-auto min-h-[297mm] font-sans text-sm leading-relaxed">

            {/* --- KOP SURAT --- */}
            <div className="flex items-center justify-center border-b-2 border-black pb-4 mb-8 gap-6">
                {/* Placeholder Logo (Ganti dengan <Image> jika perlu) */}
                <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">
                    LOGO
                </div>
                <div className="text-center">
                    <h2 className="text-lg font-bold text-[#e31e25]">UNIVERSITAS TELKOM</h2>
                    <h1 className="text-xl font-bold">FAKULTAS EKONOMI DAN BISNIS</h1>
                    <p className="text-xs text-gray-600 mt-1">
                        Gedung Manterawu, Jl. Telekomunikasi No. 1, Terusan Buahbatu, Bandung
                    </p>
                </div>
            </div>

            <div className="text-center mb-8">
                <h1 className="text-xl font-bold underline decoration-2 underline-offset-4 uppercase">
                    NOTULENSI RAPAT
                </h1>
                <p className="text-sm mt-1 text-gray-600 font-medium">{data.judulRapat}</p>
            </div>

            <div className="mb-8">
                <table className="w-full">
                    <tbody>
                        <tr>
                            <td className="font-bold w-40 py-1 align-top">Hari, Tanggal</td>
                            <td className="py-1 align-top">: {formatDate(data.tanggal)}</td>
                        </tr>
                        <tr>
                            <td className="font-bold py-1 align-top">Waktu</td>
                            <td className="py-1 align-top">: {data.waktu} WIB</td>
                        </tr>
                        <tr>
                            <td className="font-bold py-1 align-top">Tempat</td>
                            <td className="py-1 align-top">: {data.tempat}</td>
                        </tr>
                        <tr>
                            <td className="font-bold py-1 align-top">Pemimpin Rapat</td>
                            <td className="py-1 align-top">: {data.pemimpin}</td>
                        </tr>
                        <tr>
                            <td className="font-bold py-1 align-top">Notulis</td>
                            <td className="py-1 align-top">: {data.notulen}</td>
                        </tr>
                        <tr>
                            <td className="font-bold py-1 align-top">Peserta</td>
                            <td className="py-1 align-top">
                                : {data.peserta && data.peserta.length > 0 ? data.peserta.join(', ') : '-'}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* --- PEMBAHASAN AGENDA --- */}
            <div className="mb-8">
                <h3 className="font-bold text-lg mb-4 border-b border-gray-300 pb-1">
                    A. Pembahasan & Keputusan
                </h3>

                <div className="space-y-6">
                    {data.pembahasanKeputusan?.map((item, index) => (
                        <div key={index} className="break-inside-avoid">
                            <h4 className="font-bold text-base mb-2">
                                {index + 1}. {item.agenda}
                            </h4>
                            <div className="ml-5 border-l-2 border-gray-200 pl-4 space-y-3">
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase">Pembahasan</span>
                                    <p className="text-justify mt-1 whitespace-pre-line">
                                        {item.pembahasan || "-"}
                                    </p>
                                </div>
                                {item.keputusan && item.keputusan !== "-" && (
                                    <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                                        <span className="text-xs font-bold text-green-700 uppercase">Keputusan</span>
                                        <p className="font-medium mt-1 whitespace-pre-line">
                                            {item.keputusan}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {(!data.pembahasanKeputusan || data.pembahasanKeputusan.length === 0) && (
                        <p className="text-gray-500 italic">Tidak ada pembahasan.</p>
                    )}
                </div>
            </div>
            {/* --- TINDAK LANJUT --- */}
            <div className="mb-12 pt-18 break-inside-avoid">
                <h3 className="font-bold text-lg mb-4 border-b border-gray-300 pb-1">
                    B. Tindak Lanjut
                </h3>

                <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border border-gray-300 p-2 text-center w-10">No</th>
                            <th className="border border-gray-300 p-2 text-left">Tugas</th>
                            <th className="border border-gray-300 p-2 text-left w-1/4">PIC</th>
                            <th className="border border-gray-300 p-2 text-center w-32">Deadline</th>
                            <th className="border border-gray-300 p-2 text-center w-24">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* 1. KITA LOOPING PER AGENDA, BUKAN FLAT ACTION ITEMS */}
                        {data.pembahasanKeputusan?.map((agendaItem, agendaIndex) => {

                            const hasActionItems = agendaItem.tindakLanjut && agendaItem.tindakLanjut.length > 0;

                            if (!hasActionItems) return null

                            return (
                                <React.Fragment key={agendaIndex}>
                                    {/* 2. ROW HEADER AGENDA */}
                                    <tr className="bg-gray-50">
                                        <td colSpan={5} className="border border-gray-300 p-2 font-bold text-left text-gray-700">
                                            Agenda {agendaIndex + 1}: {agendaItem.agenda}
                                        </td>
                                    </tr>

                                    {/* 3. ROW ITEM TUGASNYA */}
                                    {agendaItem.tindakLanjut.map((tugas, tugasIndex) => (
                                        <tr key={tugas.id || tugasIndex}>
                                            <td className="border border-gray-300 p-2 text-center align-top">
                                                {/* Penomoran: 1.1, 1.2, dst biar keliatan anak siapa */}
                                                {agendaIndex + 1}.{tugasIndex + 1}
                                            </td>
                                            <td className="border border-gray-300 p-2 align-top">
                                                <div className="mb-1">{tugas.tugas}</div>
                                                {/* Optional: Tampilkan Notes jika ada, biar lengkap */}
                                                {/* (tugas.notes bisa kamu tambahkan di mapping NotulensiDetailPage dulu kalau mau ditampilkan) */}
                                            </td>
                                            <td className="border border-gray-300 p-2 font-medium align-top">
                                                {tugas.penanggungJawab}
                                            </td>
                                            <td className="border border-gray-300 p-2 text-center align-top">
                                                {formatDate(tugas.deadline)}
                                            </td>
                                            <td className="border border-gray-300 p-2 text-center align-top">
                                                <span className={`inline-block px-2 py-0.5 rounded text-xs border font-medium ${tugas.status === 'Open'
                                                    ? 'border-red-200 text-red-700 bg-red-50'
                                                    : 'border-green-200 text-green-700 bg-green-50'
                                                    }`}>
                                                    {tugas.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            );
                        })}

                        {/* 4. HANDLING JIKA SAMA SEKALI TIDAK ADA TUGAS DI SEMUA AGENDA */}
                        {(!data.pembahasanKeputusan || data.pembahasanKeputusan.every(a => !a.tindakLanjut || a.tindakLanjut.length === 0)) && (
                            <tr>
                                <td colSpan={5} className="border border-gray-300 p-8 text-center text-gray-500 italic">
                                    Tidak ada tindak lanjut yang perlu dilakukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- TANDA TANGAN --- */}
            {/* <div className="flex justify-between mt-16 break-inside-avoid px-8">
                <div className="text-center">
                    <p className="mb-20">Notulis,</p>
                    <p className="font-bold border-b border-black inline-block min-w-[150px]">
                        {data.notulen}
                    </p>
                </div>
                <div className="text-center">
                    <p className="mb-20">Mengetahui,<br />Pemimpin Rapat</p>
                    <p className="font-bold border-b border-black inline-block min-w-[150px]">
                        {data.pemimpin}
                    </p>
                </div>
            </div> */}

        </div>
    )
})

MeetingDocument.displayName = 'MeetingDocument'
export default MeetingDocument