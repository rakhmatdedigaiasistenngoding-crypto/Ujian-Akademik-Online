import { createFileRoute } from "@tanstack/react-router";
import ExamApp from "@/components/exam/ExamApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sistem Ujian Berbasis Online" },
      {
        name: "description",
        content:
          "Antarmuka ujian online minimalis: login, dashboard mahasiswa, pengerjaan ujian, dan panel dosen.",
      },
      { property: "og:title", content: "Sistem Ujian Berbasis Online" },
      {
        property: "og:description",
        content: "Platform ujian online yang ringan, bersih, dan mobile-first.",
      },
    ],
  }),
  component: ExamApp,
});
