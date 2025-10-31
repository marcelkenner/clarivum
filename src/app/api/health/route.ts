import { NextResponse } from "next/server";
import { EnvironmentManager } from "@/config/environment";

const environmentManager = new EnvironmentManager(process.env);

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      env: environmentManager.getEnvironment().name,
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
    },
  );
}
