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

export default function AddKriteriaDialog({
  open,
  onOpenChange,
  onSuccess,
  columns,
  title,
}) {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data to submit:", formData);
    onSuccess?.();
    onOpenChange(false);
    setFormData({});
  };

  const renderField = (column) => {
    const value = formData[column.key] || "";

    switch (column.type) {
      case "textarea":
        return (
          <Textarea
            id={column.key}
            placeholder={`Masukkan ${column.label.toLowerCase()}...`}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [column.key]: e.target.value })
            }
            rows={3}
          />
        );

      case "select":
        return (
          <Select
            value={value}
            onValueChange={(val) =>
              setFormData({ ...formData, [column.key]: val })
            }
          >
            <SelectTrigger>
              <SelectValue
                placeholder={`Pilih ${column.label.toLowerCase()}`}
              />
            </SelectTrigger>
            <SelectContent>
              {column.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "number":
        return (
          <Input
            id={column.key}
            type="number"
            placeholder={`Masukkan ${column.label.toLowerCase()}`}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [column.key]: e.target.value })
            }
          />
        );

      default:
        return (
          <Input
            id={column.key}
            placeholder={`Masukkan ${column.label.toLowerCase()}`}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [column.key]: e.target.value })
            }
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Data - {title}</DialogTitle>
          <DialogDescription>
            Isi form di bawah untuk menambahkan data baru
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {columns.map((column) => (
              <div
                key={column.key}
                className={column.type === "textarea" ? "md:col-span-2" : ""}
              >
                <Label htmlFor={column.key}>{column.label}</Label>
                {renderField(column)}
              </div>
            ))}
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
