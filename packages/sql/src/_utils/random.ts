export function password(length = 16) {
  return btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(length))))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}
