/** Replace {{ $json.field }} with values from previous node output */
export function fillTemplate(text: string, data: any): string {
  if (!text || data == null) return text;

  const source = Array.isArray(data) ? data[0] : data;

  return text.replace(/\{\{\s*\$json(?:\.(.*?))?\s*\}\}/g, (_match, path) => {
    if (!path) return JSON.stringify(source);

    const parts = path.split(".");
    let value: any = source;
    for (const part of parts) {
      value = value?.[part];
    }

    return value !== undefined ? String(value) : `{{$json.${path}}}`;
  });
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
