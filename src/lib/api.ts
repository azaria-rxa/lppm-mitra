import { NextResponse } from "next/server";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true as const, data }, init);
}

export function fail(message: string, status = 400) {
  return NextResponse.json({ ok: false as const, error: message }, { status });
}

export function unauthorized(message = "Tidak memiliki akses") {
  return fail(message, 401);
}

export function forbidden(message = "Tidak memiliki izin untuk fitur ini") {
  return fail(message, 403);
}