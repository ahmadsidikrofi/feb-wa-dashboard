"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  CheckCircle2,
  Download,
  ExternalLink,
  Calendar,
  TrendingUp,
  Edit,
  Search,
  PlusCircleIcon,
} from "lucide-react";
import { toast } from "sonner";
import TableManagementReport from "@/components/ManagementReport/table-management-report";

export default function LaporanManagementPage() {
  const [indicators, setIndicators] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredIndicators = indicators.filter(
    (indicator) =>
      indicator.indikator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      indicator.linkEvidence.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const totalIndicators = indicators.length;
  const completedTW1 = indicators.filter((i) => i.tw1).length;
  const completedTW2 = indicators.filter((i) => i.tw2).length;
  const completedTW3 = indicators.filter((i) => i.tw3).length;
  const completedTW4 = indicators.filter((i) => i.tw4).length;

  const handleStatusUpdate = (indicatorId, quarter, value) => {
    setIndicators(
      indicators.map((ind) =>
        ind.id === indicatorId ? { ...ind, [quarter]: value } : ind
      )
    );
    toast.success("Status berhasil diperbarui");
  };

  const handleEditIndicator = (indicator) => {
    setSelectedIndicator({ ...indicator });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    setIndicators(
      indicators.map((ind) =>
        ind.id === selectedIndicator.id ? selectedIndicator : ind
      )
    );
    setIsEditDialogOpen(false);
    toast.success("Indikator berhasil diperbarui");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#e31e25]">
            Laporan Management
          </h1>
          <p className="text-muted-foreground">
            Monitoring indikator laporan manajemen fakultas per triwulan
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Indikator
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIndicators}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Indikator LAPMAN
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TW 1</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTW1}</div>
            <p className="text-xs text-muted-foreground mt-1">
              dari {totalIndicators} indikator
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TW 2</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTW2}</div>
            <p className="text-xs text-muted-foreground mt-1">
              dari {totalIndicators} indikator
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TW 3</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTW3}</div>
            <p className="text-xs text-muted-foreground mt-1">
              dari {totalIndicators} indikator
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TW 4</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTW4}</div>
            <p className="text-xs text-muted-foreground mt-1">
              dari {totalIndicators} indikator
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progress TW 1
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round((completedTW1 / totalIndicators) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedTW1} dari {totalIndicators} indikator
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progress TW 2
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round((completedTW2 / totalIndicators) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedTW2} dari {totalIndicators} indikator
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progress TW 3
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round((completedTW3 / totalIndicators) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedTW3} dari {totalIndicators} indikator
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Progress TW 4
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round((completedTW4 / totalIndicators) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {completedTW4} dari {totalIndicators} indikator
            </p>
          </CardContent>
        </Card>
      </div>

      <TableManagementReport searchQuery={searchQuery} setSearchQuery={setSearchQuery} filteredIndicators={filteredIndicators}/>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Indikator</DialogTitle>
            <DialogDescription>
              Perbarui informasi indikator dan link evidence
            </DialogDescription>
          </DialogHeader>
          {selectedIndicator && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Indikator</label>
                <Input
                  value={selectedIndicator.indikator}
                  onChange={(e) =>
                    setSelectedIndicator({
                      ...selectedIndicator,
                      indikator: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Link Evidence</label>
                <Input
                  value={selectedIndicator.linkEvidence}
                  onChange={(e) =>
                    setSelectedIndicator({
                      ...selectedIndicator,
                      linkEvidence: e.target.value,
                    })
                  }
                  placeholder="Pisahkan multiple link dengan enter"
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
                        tw1: checked,
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
                        tw2: checked,
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
                        tw3: checked,
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
                        tw4: checked,
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
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
