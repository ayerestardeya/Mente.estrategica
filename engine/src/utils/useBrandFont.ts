// Carga determinista de la fuente local de la marca: el render espera a que esté lista.
import { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import type { BrandTheme } from "./themeProvider";

export function useBrandFont(theme: BrandTheme): void {
  const { fontFile, fuente, fontWeight } = theme;
  const [handle] = useState(() => (fontFile && fuente ? delayRender(`Fuente ${fuente} ${fontWeight}`) : null));

  useEffect(() => {
    if (handle === null || !fontFile || !fuente) return;
    const face = new FontFace(fuente, `url('${staticFile(fontFile)}') format('woff2')`, {
      weight: String(fontWeight),
    });
    face
      .load()
      .then((f) => {
        document.fonts.add(f);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [handle, fontFile, fuente, fontWeight]);
}
