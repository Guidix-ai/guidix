// app/upskill/page.js
import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import ComingSoon from "@/components/ComingSoon";

export default function UpskillPage() {
  return (
    <DashboardLayout>
      <ComingSoon title="Upskill" />
    </DashboardLayout>
  );
}
