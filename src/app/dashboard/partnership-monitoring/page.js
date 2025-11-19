import { SquareDashedBottomCodeIcon } from "lucide-react"

const PartnershipMonitoring = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start mt-1 gap-3">
                    <div className="bg-emerald-500 rounded-full w-14 h-14 flex justify-center items-center">
                        <SquareDashedBottomCodeIcon className="size-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-emerald-600">Dokumen Kerjasama</h1>
                        <p className="text-muted-foreground">
                            Pantau tatus dokumen kerjasama MoU maupun MoA yang telah atau sedang dijalankan bersama mitra.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PartnershipMonitoring