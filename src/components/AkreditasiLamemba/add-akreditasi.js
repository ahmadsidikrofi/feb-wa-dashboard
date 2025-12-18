"use client";

import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function AddAkreditasiDialog({ open, onOpenChange, onSuccess }) {
  const [formData, setFormData] = useState({
    programStudi: "",
    fakultas: "",
    statusAkreditasi: "",
    nomorSK: "",
    tanggalBerlaku: null,
    tanggalKadaluarsa: null,
    nilaiAkreditasi: "",
    keterangan: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulasi submit - nanti bisa diganti dengan API call
    console.log("Data to submit:", formData);
    onSuccess?.();
    onOpenChange(false);
    // Reset form
    setFormData({
      programStudi: "",
      fakultas: "",
      statusAkreditasi: "",
      nomorSK: "",
      tanggalBerlaku: null,
      tanggalKadaluarsa: null,
      nilaiAkreditasi: "",
      keterangan: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Data Akreditasi</DialogTitle>
          <DialogDescription>
            Isi form di bawah untuk menambahkan data akreditasi LAMEMBA baru
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="programStudi">Program Studi *</Label>
              <Input
                id="programStudi"
                placeholder="S1 Manajemen"
                value={formData.programStudi}
                onChange={(e) =>
                  setFormData({ ...formData, programStudi: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fakultas">Fakultas *</Label>
              <Input
                id="fakultas"
                placeholder="Fakultas Ekonomi dan Bisnis"
                value={formData.fakultas}
                onChange={(e) =>
                  setFormData({ ...formData, fakultas: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="statusAkreditasi">Status Akreditasi *</Label>
              <Select
                value={formData.statusAkreditasi}
                onValueChange={(value) =>
                  setFormData({ ...formData, statusAkreditasi: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unggul">Unggul</SelectItem>
                  <SelectItem value="Baik Sekali">Baik Sekali</SelectItem>
                  <SelectItem value="Baik">Baik</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nomorSK">Nomor SK *</Label>
              <Input
                id="nomorSK"
                placeholder="SK/LAMEMBA/2024/001"
                value={formData.nomorSK}
                onChange={(e) =>
                  setFormData({ ...formData, nomorSK: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nilaiAkreditasi">Nilai Akreditasi</Label>
              <Input
                id="nilaiAkreditasi"
                type="number"
                min="0"
                max="100"
                placeholder="95"
                value={formData.nilaiAkreditasi}
                onChange={(e) =>
                  setFormData({ ...formData, nilaiAkreditasi: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Tanggal Berlaku *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.tanggalBerlaku && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.tanggalBerlaku ? (
                      format(formData.tanggalBerlaku, "PPP", { locale: id })
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.tanggalBerlaku}
                    onSelect={(date) =>
                      setFormData({ ...formData, tanggalBerlaku: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Tanggal Kadaluarsa *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.tanggalKadaluarsa && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.tanggalKadaluarsa ? (
                      format(formData.tanggalKadaluarsa, "PPP", { locale: id })
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.tanggalKadaluarsa}
                    onSelect={(date) =>
                      setFormData({ ...formData, tanggalKadaluarsa: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keterangan">Keterangan</Label>
            <Textarea
              id="keterangan"
              placeholder="Tambahkan catatan atau keterangan tambahan..."
              value={formData.keterangan}
              onChange={(e) =>
                setFormData({ ...formData, keterangan: e.target.value })
              }
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
