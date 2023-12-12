export function removeEmpty(obj) {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v != null && v != "")
      .map(([k, v]) => [k, v === Object(v) ? removeEmpty(v) : v])
  );
}
