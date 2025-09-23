// miniapp/src/app/api/verify/route.ts

import { NextRequest, NextResponse } from "next/server";
import { verifyCloudProof } from "@worldcoin/idkit";

export async function POST(req: NextRequest) {
  const { payload, action } = await req.json();
  // Usamos una variable de entorno para el App ID por seguridad
  const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;

  try {
    const verifyRes = await verifyCloudProof(payload, app_id, action);

    if (verifyRes.success) {
      // La prueba es válida. El usuario es un humano verificado.
      return NextResponse.json(
        { success: true, ...verifyRes },
        { status: 200 }
      );
    } else {
      // La prueba no es válida o el usuario ya ha realizado esta acción.
      return NextResponse.json(
        { success: false, ...verifyRes },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, detail: "Error during verification" },
      { status: 500 }
    );
  }
}
