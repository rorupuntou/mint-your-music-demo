// miniapp/src/app/api/verify/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  verifyCloudProof,
  IVerifyResponse,
  ISuccessResult,
} from "@worldcoin/idkit";

export async function POST(req: NextRequest) {
  const { payload, action } = await req.json();
  const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;

  // La función verifyCloudProof se comunica de forma segura con el backend de Worldcoin
  const verifyRes = await verifyCloudProof(payload, app_id, action);

  if (verifyRes.success) {
    // La prueba es válida. El usuario es un humano verificado.
    // Aquí podrías, por ejemplo, registrar que este usuario ya usó su verificación para esta acción.
    return NextResponse.json({ success: true, ...verifyRes }, { status: 200 });
  } else {
    // La prueba no es válida o el usuario ya ha realizado esta acción.
    return NextResponse.json({ success: false, ...verifyRes }, { status: 400 });
  }
}
