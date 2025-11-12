import { NextResponse } from "next/server";
import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import ATSTemplateWithoutPhoto_TEST from "@/components/pdf-templates/job/ATSTemplateWithoutPhoto_TEST";

export async function POST(request) {
  try {
    console.log("🔵 Generating test PDF");

    // Parse the resume data from request body
    const resumeData = await request.json();
    console.log("📄 Resume data received:", resumeData);

    // Generate PDF stream
    const stream = await renderToStream(
      <ATSTemplateWithoutPhoto_TEST resumeData={resumeData} />
    );

    console.log("✅ PDF generated successfully");

    // Return PDF as response
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="test-resume.pdf"',
      },
    });
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF", details: error.message },
      { status: 500 }
    );
  }
}
