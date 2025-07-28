export async function postJSON<TReq, TRes>(
  url: string,
  body: TReq,
  headers: Record<string, string> = {}
): Promise<TRes> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw { status: res.status, body: json }; // el errorHandler lo formatea
  }
  return json as TRes;
}
