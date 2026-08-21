import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { DataLaporan } from "@/types";
import { formatAngka } from "@/lib/utils";
import { LABEL_JENIS_MITRA, LABEL_SENTIMEN, LABEL_TIPE_PERTANYAAN } from "@/lib/laporan";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    color: "#1e293b",
    fontFamily: "Helvetica",
  },
  header: {
    borderBottom: "2px solid #1e3a8a",
    paddingBottom: 12,
    marginBottom: 16,
  },
  judul: { fontSize: 20, fontWeight: "bold", color: "#1e3a8a" },
  subJudul: { fontSize: 12, color: "#475569", marginTop: 4 },
  periode: { fontSize: 11, fontWeight: "bold", marginTop: 4, color: "#0f172a" },
  section: { marginTop: 18 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 8,
  },
  kartuStat: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
    border: "1px solid #cbd5e1",
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
  },
  statLabel: { fontSize: 9, color: "#64748b", marginBottom: 4 },
  statNilai: { fontSize: 16, fontWeight: "bold", color: "#1e3a8a" },
  statSub: { fontSize: 8, color: "#94a3b8", marginTop: 2 },
  tabel: { width: "100%", marginTop: 4 },
  row: { flexDirection: "row", borderBottom: "1px solid #e2e8f0", paddingVertical: 5 },
  rowHeader: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderBottom: "1px solid #cbd5e1",
    paddingVertical: 6,
  },
  colPertanyaan: { flex: 3, paddingRight: 8 },
  colTipe: { width: 70, paddingHorizontal: 4 },
  colSkor: { width: 55, textAlign: "right" },
  colBulan: { width: 70 },
  colBar: { flex: 1 },
  colJenis: { flex: 1 },
  cellHeader: { fontWeight: "bold", color: "#334155", fontSize: 9 },
  barLuar: {
    height: 10,
    backgroundColor: "#e2e8f0",
    borderRadius: 5,
    width: "100%",
    justifyContent: "center",
  },
  barDalam: { height: 10, borderRadius: 5 },
  komentar: {
    border: "1px solid #e2e8f0",
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 32,
    right: 32,
    fontSize: 8,
    color: "#94a3b8",
    textAlign: "center",
    borderTop: "1px solid #e2e8f0",
    paddingTop: 8,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 8,
    alignSelf: "flex-start",
  },
});

const WARNA = { POSITIF: "#16a34a", NETRAL: "#64748b", NEGATIF: "#dc2626" };

function Bar({ skor, warna }: { skor: number; warna?: string }) {
  const pct = skor != null ? Math.max(4, Math.round((skor / 5) * 100)) : 0;
  return (
    <View style={styles.barLuar}>
      <View
        style={[
          styles.barDalam,
          { width: `${pct}%`, backgroundColor: warna ?? "#1d4ed8" },
        ]}
      />
    </View>
  );
}

export function LaporanPDF({ data }: { data: DataLaporan }) {
  const skorParsen = data.indeksKepuasan != null ? (data.indeksKepuasan / 5) * 100 : null;

  return (
    <Document
      title={`Laporan Kepuasan Mitra LPPM - ${data.periodeLabel}`}
      author="SIKAP LPPM"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.judul}>Laporan Kepuasan Mitra LPPM</Text>
          <Text style={styles.subJudul}>SIKAP — Sistem Kepuasan Mitra LPPM</Text>
          <Text style={styles.periode}>Periode: {data.periodeLabel}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.kartuStat}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Indeks Kepuasan</Text>
              <Text style={styles.statNilai}>
                {data.indeksKepuasan != null ? `${formatAngka(data.indeksKepuasan)} / 5` : "N/A"}
              </Text>
              <Text style={styles.statSub}>
                {skorParsen != null ? `${formatAngka(skorParsen)}%` : "-"}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Survei Terisi</Text>
              <Text style={styles.statNilai}>{data.totalResponse}</Text>
              <Text style={styles.statSub}>respons periode ini</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Mitra</Text>
              <Text style={styles.statNilai}>{data.totalMitra}</Text>
              <Text style={styles.statSub}>terdaftar</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tren Skor Kepuasan</Text>
          {data.tren.length === 0 ? (
            <Text style={{ color: "#94a3b8" }}>Belum ada data.</Text>
          ) : (
            data.tren.map((t) => (
              <View key={t.bulan} style={[styles.row, { alignItems: "center", gap: 8 }]}>
                <View style={styles.colBulan}>
                  <Text>{t.bulan}</Text>
                </View>
                <View style={styles.colBar}>
                  <Bar skor={t.skor ?? 0} />
                </View>
                <View style={[styles.colSkor, { width: 90 }]}>
                  <Text>
                    {t.skor != null ? `${formatAngka(t.skor)} · ${t.jumlah} resp` : "belum ada"}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skor per Jenis Mitra</Text>
          <View style={styles.tabel}>
            <View style={styles.rowHeader}>
              <View style={styles.colJenis}>
                <Text style={styles.cellHeader}>Jenis Mitra</Text>
              </View>
              <View style={styles.colSkor}>
                <Text style={styles.cellHeader}>Rata-rata</Text>
              </View>
              <View style={styles.colSkor}>
                <Text style={styles.cellHeader}>Jumlah</Text>
              </View>
            </View>
            {data.perJenis.map((p) => (
              <View key={p.jenis} style={styles.row}>
                <View style={styles.colJenis}>
                  <Text>{LABEL_JENIS_MITRA[p.jenis]}</Text>
                </View>
                <View style={styles.colSkor}>
                  <Text>{p.skor != null ? formatAngka(p.skor) : "-"}</Text>
                </View>
                <View style={styles.colSkor}>
                  <Text>{p.jumlah}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skor per Pertanyaan</Text>
          <View style={styles.tabel}>
            <View style={styles.rowHeader}>
              <View style={styles.colPertanyaan}>
                <Text style={styles.cellHeader}>Pertanyaan</Text>
              </View>
              <View style={styles.colTipe}>
                <Text style={styles.cellHeader}>Tipe</Text>
              </View>
              <View style={styles.colSkor}>
                <Text style={styles.cellHeader}>Skor</Text>
              </View>
              <View style={styles.colSkor}>
                <Text style={styles.cellHeader}>N</Text>
              </View>
            </View>
            {data.perPertanyaan.length === 0 ? (
              <Text style={{ color: "#94a3b8", paddingVertical: 6 }}>
                Belum ada jawaban skala pada periode ini.
              </Text>
            ) : (
              data.perPertanyaan.map((p) => (
                <View key={p.pertanyaanId} style={styles.row}>
                  <View style={styles.colPertanyaan}>
                    <Text>{p.teks}</Text>
                  </View>
                  <View style={styles.colTipe}>
                    <Text>{LABEL_TIPE_PERTANYAAN[p.tipe]}</Text>
                  </View>
                  <View style={styles.colSkor}>
                    <Text>{p.rataRata != null ? formatAngka(p.rataRata) : "-"}</Text>
                  </View>
                  <View style={styles.colSkor}>
                    <Text>{p.totalRespons}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Komentar Mitra (Sentimen)</Text>
          {data.komentar.length === 0 ? (
            <Text style={{ color: "#94a3b8" }}>Belum ada komentar pada periode ini.</Text>
          ) : (
            data.komentar.slice(0, 12).map((k, i) => (
              <View key={i} style={styles.komentar}>
                <Text style={{ lineHeight: 1.5 }}>"{k.teks}"</Text>
                <View style={{ marginTop: 4 }}>
                  <Text
                    style={[
                      styles.badge,
                      {
                        color: WARNA[k.sentimen ?? "NETRAL"],
                        backgroundColor: `${WARNA[k.sentimen ?? "NETRAL"]}22`,
                      },
                    ]}
                  >
                    {k.sentimen ? LABEL_SENTIMEN[k.sentimen] : "Belum dianalisis"}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        <Text style={styles.footer}>
          Dokumen dihasilkan otomatis oleh SIKAP LPPM pada {data.dibuatPada || new Date().toLocaleString("id-ID")}
        </Text>
      </Page>
    </Document>
  );
}