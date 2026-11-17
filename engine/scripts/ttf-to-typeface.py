#!/usr/bin/env python3
"""Convierte una fuente TrueType (.ttf) al formato typeface.json de three.js
(el que usan FontLoader y <Text3D> de drei). Solo usa la biblioteca estándar.

Uso:
  python3 scripts/ttf-to-typeface.py <fuente.ttf> <salida.typeface.json> [--weight bold]

Incluye ASCII imprimible + Latin-1 (á é í ó ú ñ ü ¿ ¡ …). Soporta glifos simples
y compuestos (acentos). Formato de contorno de three: 'm x y', 'l x y',
'q x y cx cy' (punto final primero, luego control).
"""
import json
import struct
import sys

CHARSET = list(range(0x20, 0x7F)) + list(range(0xA1, 0x100))


class TTF:
    def __init__(self, data: bytes):
        self.d = data
        num = struct.unpack(">H", data[4:6])[0]
        self.tables = {}
        for i in range(num):
            tag, _, off, length = struct.unpack(">4sIII", data[12 + i * 16 : 28 + i * 16])
            self.tables[tag.decode("latin-1")] = (off, length)
        h = self.tables["head"][0]
        self.upem = self.u16(h + 18)
        self.bbox = [self.i16(h + 36 + k * 2) for k in range(4)]  # xMin yMin xMax yMax
        self.loca_long = self.i16(h + 50) == 1
        hh = self.tables["hhea"][0]
        self.ascender = self.i16(hh + 4)
        self.descender = self.i16(hh + 6)
        self.n_hmetrics = self.u16(hh + 34)
        self.num_glyphs = self.u16(self.tables["maxp"][0] + 4)
        p = self.tables["post"][0]
        self.ul_pos = self.i16(p + 8)
        self.ul_thick = self.i16(p + 10)
        self.cmap = self._cmap()

    def u16(self, o):
        return struct.unpack(">H", self.d[o : o + 2])[0]

    def i16(self, o):
        return struct.unpack(">h", self.d[o : o + 2])[0]

    def u32(self, o):
        return struct.unpack(">I", self.d[o : o + 4])[0]

    def _cmap(self):
        base = self.tables["cmap"][0]
        n = self.u16(base + 2)
        sub = None
        for i in range(n):
            plat, enc, off = struct.unpack(">HHI", self.d[base + 4 + i * 8 : base + 12 + i * 8])
            if plat == 3 and enc == 1 and self.u16(base + off) == 4:
                sub = base + off
        if sub is None:
            raise SystemExit("cmap formato 4 (3,1) no encontrado")
        segx2 = self.u16(sub + 6)
        ends = sub + 14
        starts = ends + segx2 + 2
        deltas = starts + segx2
        ranges = deltas + segx2
        out = {}
        for s in range(segx2 // 2):
            end = self.u16(ends + s * 2)
            start = self.u16(starts + s * 2)
            delta = self.i16(deltas + s * 2)
            ro_pos = ranges + s * 2
            ro = self.u16(ro_pos)
            for c in range(start, end + 1):
                if c == 0xFFFF:
                    continue
                if ro == 0:
                    g = (c + delta) & 0xFFFF
                else:
                    g = self.u16(ro_pos + ro + (c - start) * 2)
                    if g:
                        g = (g + delta) & 0xFFFF
                if g:
                    out[c] = g
        return out

    def advance(self, g):
        hm = self.tables["hmtx"][0]
        return self.u16(hm + min(g, self.n_hmetrics - 1) * 4)

    def _glyph_range(self, g):
        lo = self.tables["loca"][0]
        if self.loca_long:
            a, b = self.u32(lo + g * 4), self.u32(lo + g * 4 + 4)
        else:
            a, b = self.u16(lo + g * 2) * 2, self.u16(lo + g * 2 + 2) * 2
        return self.tables["glyf"][0] + a, b - a

    def contours(self, g, depth=0):
        """Lista de contornos; cada contorno = lista de (x, y, on_curve)."""
        off, length = self._glyph_range(g)
        if length == 0:
            return [], None
        nc = self.i16(off)
        bbox = [self.i16(off + 2 + k * 2) for k in range(4)]
        if nc >= 0:
            return self._simple(off, nc), bbox
        return self._composite(off, depth), bbox

    def _simple(self, off, nc):
        p = off + 10
        end_pts = [self.u16(p + i * 2) for i in range(nc)]
        p += nc * 2
        p += 2 + self.u16(p)  # instrucciones
        npts = end_pts[-1] + 1 if end_pts else 0
        flags = []
        while len(flags) < npts:
            f = self.d[p]
            p += 1
            flags.append(f)
            if f & 8:
                r = self.d[p]
                p += 1
                flags.extend([f] * r)
        flags = flags[:npts]

        def coords(short_bit, same_bit):
            nonlocal p
            vals, v = [], 0
            for f in flags:
                if f & short_bit:
                    dv = self.d[p]
                    p += 1
                    v += dv if f & same_bit else -dv
                elif not f & same_bit:
                    v += self.i16(p)
                    p += 2
                vals.append(v)
            return vals

        xs = coords(2, 16)
        ys = coords(4, 32)
        out, s = [], 0
        for e in end_pts:
            out.append([(xs[i], ys[i], bool(flags[i] & 1)) for i in range(s, e + 1)])
            s = e + 1
        return out

    def _composite(self, off, depth):
        if depth > 8:
            return []
        p = off + 10
        res = []
        while True:
            flags = self.u16(p)
            gi = self.u16(p + 2)
            p += 4
            if flags & 1:
                dx, dy = self.i16(p), self.i16(p + 2)
                p += 4
            else:
                dx, dy = struct.unpack(">bb", self.d[p : p + 2])
                p += 2
            f2 = lambda o: self.i16(o) / 16384.0
            a, b, c, dd = 1.0, 0.0, 0.0, 1.0
            if flags & 8:
                a = dd = f2(p)
                p += 2
            elif flags & 0x40:
                a, dd = f2(p), f2(p + 2)
                p += 4
            elif flags & 0x80:
                a, b, c, dd = f2(p), f2(p + 2), f2(p + 4), f2(p + 6)
                p += 8
            sub, _ = self.contours(gi, depth + 1)
            if not flags & 2:
                dx = dy = 0  # anclaje por puntos: no usado en fuentes latinas habituales
            for ct in sub:
                res.append([(a * x + c * y + dx, b * x + dd * y + dy, on) for x, y, on in ct])
            if not flags & 0x20:
                break
        return res


def contour_to_cmds(ct, k):
    r = lambda v: str(round(v * k))
    n = len(ct)
    if n == 0:
        return []
    pts = list(ct)
    # Punto inicial sobre la curva.
    if not pts[0][2]:
        if pts[-1][2]:
            pts = [pts[-1]] + pts[:-1]
        else:
            mid = ((pts[0][0] + pts[-1][0]) / 2, (pts[0][1] + pts[-1][1]) / 2, True)
            pts = [mid] + pts
    start = pts[0]
    cmds = ["m", r(start[0]), r(start[1])]
    ctrl = None
    for x, y, on in pts[1:] + [start]:
        if on:
            if ctrl:
                cmds += ["q", r(x), r(y), r(ctrl[0]), r(ctrl[1])]
            else:
                cmds += ["l", r(x), r(y)]
            ctrl = None
        else:
            if ctrl:
                mx, my = (ctrl[0] + x) / 2, (ctrl[1] + y) / 2
                cmds += ["q", r(mx), r(my), r(ctrl[0]), r(ctrl[1])]
            ctrl = (x, y)
    return cmds


def main():
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    src, dst = sys.argv[1], sys.argv[2]
    weight = sys.argv[4] if len(sys.argv) > 4 and sys.argv[3] == "--weight" else "normal"
    f = TTF(open(src, "rb").read())
    k = 1000.0 / f.upem
    glyphs = {}
    for cp in CHARSET:
        g = f.cmap.get(cp)
        if g is None:
            continue
        cts, bbox = f.contours(g)
        cmds = []
        for ct in cts:
            cmds += contour_to_cmds(ct, k)
        glyphs[chr(cp)] = {
            "ha": round(f.advance(g) * k),
            "x_min": round((bbox[0] if bbox else 0) * k),
            "x_max": round((bbox[2] if bbox else 0) * k),
            "o": " ".join(cmds),
        }
    out = {
        "glyphs": glyphs,
        "familyName": "Poppins" if "oppins" in src else "Font",
        "ascender": round(f.ascender * k),
        "descender": round(f.descender * k),
        "underlinePosition": round(f.ul_pos * k),
        "underlineThickness": round(f.ul_thick * k),
        "boundingBox": {
            "xMin": round(f.bbox[0] * k),
            "yMin": round(f.bbox[1] * k),
            "xMax": round(f.bbox[2] * k),
            "yMax": round(f.bbox[3] * k),
        },
        "resolution": 1000,
        "original_font_information": {"source": src.rsplit("/", 1)[-1], "license": "SIL OFL 1.1"},
        "cssFontWeight": weight,
        "cssFontStyle": "normal",
    }
    with open(dst, "w", encoding="utf-8") as fh:
        json.dump(out, fh, ensure_ascii=False, separators=(",", ":"))
    print(f"{len(glyphs)} glifos → {dst}")


if __name__ == "__main__":
    main()
