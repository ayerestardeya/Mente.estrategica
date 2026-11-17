// El Cerebro: contrato JSON que dicta qué animar y cuándo (todo en frames a 30 fps).
import { z } from "zod";
import { BRAND_SLUGS, SKILL_IDS } from "./constants";

export const SHOT_TYPES = ["wide", "medium", "close_up", "cinematic"] as const;
export const MOTION_INTENSITIES = ["low", "medium", "high", "aggressive"] as const;
export const SFX_TYPES = ["impact", "whoosh", "ui_click"] as const;
export const MUSIC_MOODS = ["tension", "energetic", "calm", "dark", "inspirational"] as const;

const frame = z.number().int().nonnegative();

export const visualSchema = z.object({
  shot_type: z.enum(SHOT_TYPES),
  /** Zoom total de cámara a lo largo del clip (0 = estático, 0.25 = +25%). */
  camera_zoom_speed: z.number().min(0).max(1),
  motion_intensity: z.enum(MOTION_INTENSITIES),
  /** Frames donde ocurre un pattern interrupt (glow, punch, pulso de borde). */
  pattern_interrupt_events: z.array(frame),
  /** Cada cuántos frames cambia el foco visual (KPI destacado). */
  visual_change_interval: z.number().int().positive(),
  /** Frame en que entran los módulos CTA. */
  cta_trigger_time: frame,
});

export const audioSchema = z.object({
  sfx_events: z.array(z.object({ frame, type: z.enum(SFX_TYPES) })),
  music_mood: z.enum(MUSIC_MOODS),
});

export const contenidoSchema = z.object({
  hook: z.string().min(1),
  /** Requeridos por OpusCard (dashboard); opcionales en otros skills. */
  kpis: z
    .array(
      z.object({
        label: z.string().min(1),
        valor: z.number(),
        sufijo: z.string().optional(),
        decimales: z.number().int().min(0).max(2).optional(),
      }),
    )
    .min(1)
    .max(4)
    .optional(),
  /** Serie del gráfico, valores normalizados 0..1. */
  serie: z.array(z.number().min(0).max(1)).min(3).max(12).optional(),
  badge: z.string().optional(),
});

export const ctaSchema = z.object({
  handle: z.string().min(1),
  direccion: z.string().min(1),
  titulo: z.string().min(1),
  beneficio: z.string().min(1),
  boton: z.string().min(1),
  urgencia: z.string().min(1),
  /** Progreso de la barra de urgencia, 0..100. */
  progreso: z.number().min(0).max(100),
});

export const engineSchema = z
  .object({
    marca: z.enum(BRAND_SLUGS),
    skillTarget: z.enum(SKILL_IDS),
    titulo: z.string().optional(),
    duracion_frames: z.number().int().positive(),
    visual: visualSchema,
    audio: audioSchema,
    contenido: contenidoSchema,
    cta: ctaSchema,
  })
  .superRefine((d, ctx) => {
    const fuera = (f: number) => f >= d.duracion_frames;
    d.visual.pattern_interrupt_events.forEach((f, i) => {
      if (fuera(f)) ctx.addIssue({ code: "custom", path: ["visual", "pattern_interrupt_events", i], message: `frame ${f} >= duracion_frames` });
    });
    d.audio.sfx_events.forEach((e, i) => {
      if (fuera(e.frame)) ctx.addIssue({ code: "custom", path: ["audio", "sfx_events", i, "frame"], message: `frame ${e.frame} >= duracion_frames` });
    });
    if (d.skillTarget === "OpusCard") {
      if (!d.contenido.kpis) ctx.addIssue({ code: "custom", path: ["contenido", "kpis"], message: "OpusCard requiere kpis" });
      if (!d.contenido.serie) ctx.addIssue({ code: "custom", path: ["contenido", "serie"], message: "OpusCard requiere serie" });
    }
    if (fuera(d.visual.cta_trigger_time)) {
      ctx.addIssue({ code: "custom", path: ["visual", "cta_trigger_time"], message: "cta_trigger_time >= duracion_frames" });
    }
  });

export type EngineProps = z.infer<typeof engineSchema>;
export type VisualData = z.infer<typeof visualSchema>;
export type AudioData = z.infer<typeof audioSchema>;
export type ContenidoData = z.infer<typeof contenidoSchema>;
export type CtaData = z.infer<typeof ctaSchema>;

/** Lo que un skill necesita para animar (sin datos de CTA). */
export interface EscenaData {
  visual: VisualData;
  audio: AudioData;
  contenido: ContenidoData;
}
