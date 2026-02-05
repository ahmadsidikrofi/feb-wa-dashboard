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
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import DeleteManagementReport from "./delete-management-report";
import api from "@/lib/axios";

const EditManagementReport = ({
    open,
    onOpenChange,
    selectedIndicator: propSelectedIndicator,
    onSuccess,
    setIsLoading,
    isLoading
}) => {
    const [selectedIndicator, setSelectedIndicator] = useState({
        id: null,
        indicator: "",
        evidenceLink: "",
        year: new Date().getFullYear(),
        tw1: false,
        tw2: false,
        tw3: false,
        tw4: false,
    })

    // Update state when propSelectedIndicator changes and dialog opens
    useEffect(() => {
        if (open && propSelectedIndicator) {
            setSelectedIndicator({
                id: propSelectedIndicator.id || null,
                indicator: propSelectedIndicator.indicator || "",
                evidenceLink: propSelectedIndicator.evidenceLink || "",
                year: propSelectedIndicator.year || new Date().getFullYear(),
                tw1: propSelectedIndicator.tw1 || false,
                tw2: propSelectedIndicator.tw2 || false,
                tw3: propSelectedIndicator.tw3 || false,
                tw4: propSelectedIndicator.tw4 || false,
            })
        }
    }, [propSelectedIndicator, open])

    const handleSaveEdit = async () => {
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

            await api.put(`/api/management-reports/${selectedIndicator.id}`, payload)

            onSuccess?.()
        } catch (error) {
            console.error("Gagal update indikator:", error);
            toast.error("Gagal memperbarui indikator");
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Indikator</DialogTitle>
                    <DialogDescription className="flex items-center justify-between">
                        Perbarui informasi indikator dan link evidence
                        <DeleteManagementReport
                            isLoading={isLoading}
                            setIsLoading={setIsLoading}
                            reportId={selectedIndicator.id}
                            onSuccess={onSuccess}
                        />
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
                                type="number"
                                value={
                                    selectedIndicator.year === undefined || selectedIndicator.year === ""
                                        ? new Date().getFullYear()
                                        : selectedIndicator.year
                                }
                                onChange={(e) =>
                                    setSelectedIndicator({
                                        ...selectedIndicator,
                                        year: e.target.value === "" ? undefined : parseInt(e.target.value),
                                    })
                                }
                                placeholder={String(new Date().getFullYear())}
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="tw1"
                                    checked={selectedIndicator.tw1 || false}
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
                                    checked={selectedIndicator.tw2 || false}
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
                                    checked={selectedIndicator.tw3 || false}
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
                                    checked={selectedIndicator.tw4 || false}
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
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleSaveEdit}
                        className="bg-[#e31e25] hover:bg-[#c41a20]"
                        disabled={isLoading || !selectedIndicator.id}
                    >
                        {isLoading && (
                            <Loader2 className="size-4 animate-spin mr-2" />
                        )}
                        {isLoading ? "Menyimpan" : "Simpan"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditManagementReport