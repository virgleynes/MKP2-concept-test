/** Vite public/img assets, respecting BASE_PATH for Pages/Ship-It. */
export function imgUrl(path: string) {
  const file = path.replace(/^\/+/, "");
  const base = import.meta.env.BASE_URL || "./";
  return `${base}${file}`.replace(/([^:/])\/\/+/g, "$1/");
}

export function rewriteImgSrc(html: string) {
  return html.replace(
    /src="\/img\//g,
    `src="${imgUrl("img/").replace(/"/g, "&quot;")}`,
  );
}
