'use client'

import { useEffect, useState } from "react";

import TableContractManagement from "@/components/ContractManagement/TableContractManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  CheckCircle2,
  FileText,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

const iconMap = {
  FileText,
  Target,
  CheckCircle2,
  BarChart3,
};

const KontrakManagement = () => {
  const [statsData, setStatsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contract-management/stats`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          console.error("Gagal mengambil data stats:", res.statusText);
          return;
        }

        const json = await res.json();

        if (!ignore && json?.success && Array.isArray(json.data)) {
          const mapped = json.data.map((item) => ({
            ...item,
            iconKey: item.iconKey,
          }));
          setStatsData(mapped);
        }
      } catch (error) {
        console.error("Error fetch stats:", error);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start mt-1 gap-3">
          <div className="bg-[#e31e25] rounded-full w-14 h-14 flex justify-center items-center">
            <FileText className="size-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#e31e25]">Dokumen Kontrak Manajemen</h1>
            <p className="text-muted-foreground">
              Pantau status dokumen Kontrak Manajemen (KM) sedang diajukan.
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsData.map((stat, index) => {
            const IconComponent = iconMap[stat.iconKey] || FileText;

            return (
              <Card key={index} className={isLoading ? "animate-pulse" : ""}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span
                      className={
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }
                    >
                      {stat.change}
                    </span>
                    <span>{stat.description}</span>
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <TableContractManagement />
    </div>
  )
}

export default KontrakManagement