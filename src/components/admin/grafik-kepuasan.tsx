"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SkorPerJenisMitra, TrenBulanan } from "@/types";
import { LABEL_JENIS_MITRA } from "@/lib/laporan";
import { formatAngka } from "@/lib/utils";

const WARNA_JENIS: Record<string, string> = {
  DESA_BINAAN: "#1d4ed8",
  INDUSTRI: "#0ea5e9",
  INSTANSI_PEMERINTAH: "#8b5cf6",
};

export function GrafikTren({ data }: { data: TrenBulanan[] }) {
  const normalisasi = data.map((d) => ({
    ...d,
    skorTampil: d.skor != null ? Number(d.skor.toFixed(2)) : null,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={normalisasi} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gradSkor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1d4ed8" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="bulan" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
        <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value) => {
            const v = typeof value === "number" ? value : null;
            return [v != null ? formatAngka(v) : "-", "Skor"];
          }}
          contentStyle={{ borderRadius: 8, fontSize: 13 }}
        />
        <Area
          type="monotone"
          dataKey="skorTampil"
          name="Skor kepuasan"
          stroke="#1d4ed8"
          strokeWidth={2}
          fill="url(#gradSkor)"
          connectNulls
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function GrafikPerJenis({ data }: { data: SkorPerJenisMitra[] }) {
  const normalisasi = data.map((d) => ({
    jenis: LABEL_JENIS_MITRA[d.jenis],
    skor: d.skor != null ? Number(d.skor.toFixed(2)) : null,
    jumlah: d.jumlah,
    warna: WARNA_JENIS[d.jenis],
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={normalisasi} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="jenis" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value) => {
            const v = typeof value === "number" ? value : null;
            return [v != null ? formatAngka(v) : "-", "Skor"];
          }}
          contentStyle={{ borderRadius: 8, fontSize: 13 }}
        />
        <Legend />
        <Bar
          dataKey="skor"
          name="Skor rata-rata"
          radius={[6, 6, 0, 0]}
          maxBarSize={56}
          label={({ x, y, width, value }: { x?: number; y?: number; width?: number; value?: number | null }) => (
            <text
              x={(x ?? 0) + (width ?? 0) / 2}
              y={(y ?? 0) - 6}
              textAnchor="middle"
              fontSize={12}
              fontWeight={600}
              fill="#334155"
            >
              {value != null ? formatAngka(value) : "-"}
            </text>
          )}
        >
          {normalisasi.map((d, i) => (
            <Cell key={i} fill={d.warna} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}