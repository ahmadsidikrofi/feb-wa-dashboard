'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";

const AddManagementReport = ({ open, onOpenChange, onSuccess, isLoading, setIsLoading }) => {
    const [selectedIndicator, setSelectedIndicator] = useState({
        indicator: "",
        evidenceLink: "",
        year: new Date().getFullYear(),
        tw1: false,
        tw2: false,
        tw3: false,
        tw4: false,
    })

    const handleSaveEdit = async () => {
        if (!selectedIndicator.indicator) {
            return toast.error("Oops... Indikator jangan dibiarkan kosong ya", {
                style: { background: "#fee2e2", color: "#991b1b" },
                className: "border border-red-500"
            })
        }

        if (!selectedIndicator.year) {
            return toast.error("Oops... Tahun jangan dibiarkan kosong ya", {
                style: { background: "#fee2e2", color: "#991b1b" },
                className: "border border-red-500"
            })
        }

        if (!selectedIndicator.tw1 && !selectedIndicator.tw2 && !selectedIndicator.tw3 && !selectedIndicator.tw4) {
            return toast.error("Oops... Minimal pilih salah satu Triwulan (TW) ya", {
                style: { background: "#fee2e2", color: "#991b1b" },
                className: "border border-red-500"
            })
        }

        try {
            setIsLoading(true)
            const payload = {
                indicator: selectedIndicator.indicator,
                evidenceLink: selectedIndicator.evidenceLink,
                year: selectedIndicator.year,
                tw1: selectedIndicator.tw1 || false,
                tw2: selectedIndicator.tw2 || false,
                tw3: selectedIndicator.tw3 || false,
                tw4: selectedIndicator.tw4 || false,
            }

            const res = await api.post(`/api/management-reports`, payload)

            onSuccess?.()
            toast.success("Berhasil menambahkan indikator")
        } catch (error) {
            console.error("Gagal menyimpan management report:", error)
            toast.error("Gagal menyimpan management report")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Tambahkan Indikator</DialogTitle>
                    <DialogDescription>
                        Berikan informasi indikator dan link evidence
                    </DialogDescription>
                </DialogHeader>
                {selectedIndicator && (
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Indikator</label>
                            <Input
                                value={selectedIndicator.indicator || ""}
                                onChange={(e) =>
                                    setSelectedIndicator({
                                        ...selectedIndicator,
                                        indicator: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Link Evidence</label>
                            <Input
                                value={selectedIndicator.evidenceLink || ""}
                                onChange={(e) =>
                                    setSelectedIndicator({
                                        ...selectedIndicator,
                                        evidenceLink: e.target.value,
                                    })
                                }
                                placeholder="Pisahkan multiple link dengan enter"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Tahun</label>
                            <Input
                                value={
                                    selectedIndicator.year === undefined || selectedIndicator.year === ""
                                        ? new Date().getFullYear()
                                        : selectedIndicator.year
                                }
                                onChange={(e) =>
                                    setSelectedIndicator({
                                        ...selectedIndicator,
                                        year: e.target.value === "" ? undefined : e.target.value,
                                    })
                                }
                                placeholder={new Date().getFullYear()}
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="tw1"
                                    checked={selectedIndicator.tw1}
                                    onCheckedChange={(checked) =>
                                        setSelectedIndicator({
                                            ...selectedIndicator,
                                            tw1: checked === true,
                                        })
                                    }
                                />
                                <label htmlFor="tw1" className="text-sm font-medium">
                                    TW 1
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="tw2"
                                    checked={selectedIndicator.tw2}
                                    onCheckedChange={(checked) =>
                                        setSelectedIndicator({
                                            ...selectedIndicator,
                                            tw2: checked === true,
                                        })
                                    }
                                />
                                <label htmlFor="tw2" className="text-sm font-medium">
                                    TW 2
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="tw3"
                                    checked={selectedIndicator.tw3}
                                    onCheckedChange={(checked) =>
                                        setSelectedIndicator({
                                            ...selectedIndicator,
                                            tw3: checked === true,
                                        })
                                    }
                                />
                                <label htmlFor="tw3" className="text-sm font-medium">
                                    TW 3
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="tw4"
                                    checked={selectedIndicator.tw4}
                                    onCheckedChange={(checked) =>
                                        setSelectedIndicator({
                                            ...selectedIndicator,
                                            tw4: checked === true,
                                        })
                                    }
                                />
                                <label htmlFor="tw4" className="text-sm font-medium">
                                    TW 4
                                </label>
                            </div>
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsEditDialogOpen(false)}
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleSaveEdit}
                        className="bg-[#e31e25] hover:bg-[#c41a20]"
                        disabled={isLoading}
                    >
                        {isLoading && (
                            <Loader2 className="size-4 animate-spin" />
                        )}
                        {isLoading ? "Menyimpan" : "Simpan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddManagementReport