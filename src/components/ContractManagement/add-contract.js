'use state'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import api from '@/lib/axios'

export const contractManagementSchema = z.object({
    ContractManagementCategory: z.enum([
        "Financial",
        "NonFinancial",
        "InternalBusinessProcess",
    ]),
    responsibility: z.string().min(1, "Responsibility wajib diisi"),
    quarterly: z.enum(["TW-1", "TW-2", "TW-3", "TW-4"]),

    unit: z.string().optional(),

    weight: z.coerce.number().optional(),
    target: z.string().optional(),
    realization: z.coerce.number().optional(),

    min: z.coerce.number().optional(),
    max: z.coerce.number().optional(),

    input: z.string().optional(),
    monitor: z.string().optional(),
})

const AddContract = ({ getContractData }) => {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const createContractManagement = async (values) => {
        setIsLoading(true)
        try {
            const payload = {
                ...values,
                // Pastikan angka dikonversi benar, dan string kosong jadi null/undefined
                weight: values.weight === "" ? null : Number(values.weight),
                target: values.target === "" ? null : String(values.target),
                realization: values.realization === "" ? null : Number(values.realization),
                min: values.min === "" ? null : Number(values.min),
                max: values.max === "" ? null : Number(values.max),
            }

            const res = await api.post(`/api/contract-management`, payload)
            if (res.status === 200 || res.status === 201) {
                setOpen(false)
                form.reset()
                toast.success("Kontrak KM berhasil ditambahkan", {
                    style: { background: "#059669", color: "#d1fae5" },
                    className: "border border-emerald-500"
                })
                getContractData(1)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Kontrak KM gagal ditambahkan", {
                style: { background: "#fee2e2", color: "#991b1b" },
                className: "border border-red-500"
            })
        } finally {
            setIsLoading(false)
        }
    }

    const form = useForm({
        resolver: zodResolver(contractManagementSchema),
        defaultValues: {
            ContractManagementCategory: "NonFinancial",
            quarterly: "TW-4",
            responsibility: "",
            unit: "",
            weight: "",
            target: "",
            realization: "",
            min: "",
            max: "",
            Input: "",
            Monitor: "",
        }
    })
    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>+ Tambah KM</Button>
                </DialogTrigger>

                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Tambah Contract Management</DialogTitle>
                    </DialogHeader>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(createContractManagement)}
                            className="space-y-6 max-h-[70vh] overflow-y-auto pr-2"
                        >
                            {/* ====== SECTION: KATEGORI ====== */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="ContractManagementCategory"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Kategori</FormLabel>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih kategori" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Financial">Financial</SelectItem>
                                                    <SelectItem value="NonFinancial">Non Financial</SelectItem>
                                                    <SelectItem value="InternalBusinessProcess">
                                                        Internal Business Process
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="quarterly"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Triwulan</FormLabel>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih TW" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="TW-1">TW-1</SelectItem>
                                                    <SelectItem value="TW-2">TW-2</SelectItem>
                                                    <SelectItem value="TW-3">TW-3</SelectItem>
                                                    <SelectItem value="TW-4">TW-4</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* ====== RESPONSIBILITY ====== */}
                            <FormField
                                control={form.control}
                                name="responsibility"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Responsibility</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Contoh: Operating Ratio Fakultas"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* ====== SECTION: NUMERIC ====== */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="unit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Unit</FormLabel>
                                            <FormControl>
                                                <Input placeholder="%, Jumlah, Skor" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="weight"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Bobot</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="target"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Target</FormLabel>
                                            <FormControl>
                                                <Input type="text" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="realization"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Realisasi</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="min"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Min</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="max"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Max</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* ====== SECTION: CATATAN ====== */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="Input"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Input</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="Monitor"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Monitor</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter className="pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpen(false)}
                                >
                                    Batal
                                </Button>

                                <Button type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </span>
                                    ) : (
                                        "Simpan Data KM"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddContract