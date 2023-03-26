import { deflateSync, inflateSync } from 'fflate'
import { Base64 } from 'js-base64'

export function compressToUriEncoded(value: string) {
  const buffer = new TextEncoder().encode(value)
  const compressed = deflateSync(buffer, { level: 9 })
  return Base64.fromUint8Array(compressed, true)
}

export function decompressFromUriEncoded(encoded: string) {
  const compressed = Base64.toUint8Array(encoded)
  const uncompressed = inflateSync(compressed)
  return new TextDecoder().decode(uncompressed)
}
