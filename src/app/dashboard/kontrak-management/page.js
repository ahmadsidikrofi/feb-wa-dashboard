import TableContractManagement from "@/components/ContractManagement/TableContractManagement"
import { FileText } from "lucide-react"

const KontrakManagement = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start mt-1 gap-3">
                    <div className="bg-[#e31e25] rounded-full w-14 h-14 flex justify-center items-center">
                        <FileText className="size-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-[#e31e25]">Dokumen Kontrak Management</h1>
                        <p className="text-muted-foreground">
                            Pantau status dokumen Kontrak Management (KM) sedang diajukan.
                        </p>
                    </div>
                </div>
            </div>

            <TableContractManagement />
        </div>
    )
}

export default KontrakManagement