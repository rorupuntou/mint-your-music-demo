// miniapp/src/app/api/verify/route.ts

import { NextRequest, NextResponse } from "next/server";
// La documentación indica que verifyCloudProof está en minikit-js, pero las últimas versiones lo movieron a idkit
import { verifyCloudProof } from "@worldcoin/idkit";

export async function POST(req: NextRequest) {
  const { payload, action } = await req.json();
  const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;

  try {
    const verifyRes = await verifyCloudProof(payload, app_id, action);

    if (verifyRes.success) {
      // La prueba es válida. verifyRes ya contiene { success: true, ... }
      return NextResponse.json(verifyRes, { status: 200 });
    } else {
      // La prueba no es válida. verifyRes ya contiene { success: false, ... }
      return NextResponse.json(verifyRes, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, detail: "Error during verification" },
      { status: 500 }
    );
  }
}
