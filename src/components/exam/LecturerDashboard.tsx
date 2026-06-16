import { useState } from "react";
import { GraduationCap, LogOut, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LecturerMonitoringTab } from "./LecturerMonitoringTab";
import { LecturerManagementTab } from "./LecturerManagementTab";
import { LecturerClassesTab } from "./LecturerClassesTab";
import { LecturerQuestionsTab } from "./LecturerQuestionsTab";
import { useAuthStore } from "@/stores/authStore";

interface LecturerDashboardProps {
  onLogout: () => void;
}

export function LecturerDashboard({ onLogout }: LecturerDashboardProps) {
  const { user } = useAuthStore();
  const lecturerName = user?.name || "Dr. Rina Hartanti";
  const initials = lecturerName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-brand" />
            <span className="text-sm font-semibold">Panel Dosen</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right leading-tight sm:block">
              <div className="text-sm font-medium">{lecturerName}</div>
              <div className="text-xs text-muted-foreground">Dosen Pengampu</div>
            </div>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-brand-soft text-brand">{initials}</AvatarFallback>
            </Avatar>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={onLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Keluar dari akun</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Tabs defaultValue="management" className="w-full">
          <TabsList className="mb-6 grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="management">Manajemen Ujian</TabsTrigger>
            <TabsTrigger value="classes">Daftar Kelas</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="bank">Bank Soal</TabsTrigger>
          </TabsList>

          <TabsContent value="management" className="mt-0 outline-none">
            <LecturerManagementTab />
          </TabsContent>

          <TabsContent value="classes" className="mt-0 outline-none">
            <LecturerClassesTab />
          </TabsContent>

          <TabsContent value="monitoring" className="mt-0 outline-none">
            <LecturerMonitoringTab />
          </TabsContent>

          <TabsContent value="bank" className="mt-0 outline-none">
            <LecturerQuestionsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
