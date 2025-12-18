"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, FileText, GraduationCap, Award } from "lucide-react";

export default function DetailAkreditasiDrawer({ open, onOpenChange, data }) {
  if (!data) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      Unggul: "default",
      "Baik Sekali": "secondary",
      Baik: "outline",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getPeringkatBadge = (peringkat) => {
    const colors = {
      A: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      B: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      C: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    };
    return (
      <Badge className={colors[peringkat] || ""}>Peringkat {peringkat}</Badge>
    );
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Detail Akreditasi Program Studi
            </DrawerTitle>
            <DrawerDescription>
              Informasi lengkap mengenai akreditasi LAMEMBA
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-6 space-y-6">
            {/* Header Info */}
            <div className="space-y-3">
              <div>
                <h3 className="text-2xl font-bold">{data.programStudi}</h3>
                <p className="text-muted-foreground">{data.fakultas}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {getStatusBadge(data.statusAkreditasi)}
                {getPeringkatBadge(data.peringkat)}
                {data.nilaiAkreditasi && (
                  <Badge variant="outline">
                    <Award className="h-3 w-3 mr-1" />
                    Nilai: {data.nilaiAkreditasi}
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Detail Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <FileText className="h-4 w-4" />
                    Nomor SK
                  </div>
                  <p className="font-mono text-sm font-medium">
                    {data.nomorSK}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    Tanggal Berlaku
                  </div>
                  <p className="font-medium">
                    {formatDate(data.tanggalBerlaku)}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    Tanggal Kadaluarsa
                  </div>
                  <p className="font-medium">
                    {formatDate(data.tanggalKadaluarsa)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Status Akreditasi
                  </div>
                  <p className="font-medium">{data.statusAkreditasi}</p>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Peringkat
                  </div>
                  <p className="font-medium text-2xl">{data.peringkat}</p>
                </div>

                {data.nilaiAkreditasi && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Nilai Akreditasi
                    </div>
                    <p className="font-medium text-2xl">
                      {data.nilaiAkreditasi}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {data.keterangan && (
              <>
                <Separator />
                <div>
                  <div className="text-sm text-muted-foreground mb-2">
                    Keterangan
                  </div>
                  <p className="text-sm leading-relaxed">{data.keterangan}</p>
                </div>
              </>
            )}

            {/* Timeline Info */}
            <Separator />
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Masa Berlaku Akreditasi</h4>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-muted-foreground">Mulai</p>
                  <p className="font-medium">
                    {formatDate(data.tanggalBerlaku)}
                  </p>
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-1 bg-gradient-to-r from-green-500 to-orange-500 rounded-full" />
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Berakhir</p>
                  <p className="font-medium">
                    {formatDate(data.tanggalKadaluarsa)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Tutup</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
