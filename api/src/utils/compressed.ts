import * as zlib from "zlib";

export function baseencode(json: unknown): string {
  const jsonStr = JSON.stringify(json);
  const compressed = zlib.gzipSync(Buffer.from(jsonStr, "utf-8"));
  return compressed.toString("base64");
}

export function basedecode(base64Str: string): any {
  if (!base64Str) return [];
  try {
    const compressedBuffer = Buffer.from(base64Str, "base64");
    const decompressed = zlib.gunzipSync(compressedBuffer);
    return JSON.parse(decompressed.toString("utf-8"));
  } catch (error) {
    console.error("Erro ao descomprimir servicesEnd:", error);
    return [];
  }
}
