import { z } from 'zod'

/**
 * Schema for atomized image prompts
 * Defines the detailed structure for analyzing and generating images
 */
export const imageAtomizationSchema = z.object({
  scene: z
    .object({
      setting: z
        .string()
        .describe(
          'Primary environment or backdrop, e.g., forest, urban street, spaceship interior.'
        ),
      time: z
        .string()
        .nullable()
        .describe('Temporal context, e.g., dawn, night, winter, 1950s, future.'),
      weather: z
        .string()
        .nullable()
        .describe('Environmental conditions, e.g., sunny, rainy, foggy, snowy.'),
      background: z
        .string()
        .nullable()
        .describe('Details of what appears behind the subjects, e.g., mountain range, starry sky.'),
      context: z
        .string()
        .nullable()
        .describe('Additional narrative or thematic elements, e.g., festive, somber, chaotic.'),
    })
    .describe('Defines the environment and setting where the subjects exist.'),

  subjects: z
    .array(
      z.object({
        type: z.string().describe('Type of subject, e.g., character, object, landscape, animal.'),
        description: z
          .string()
          .describe('Detailed description of the subject, including key features.'),
        pose: z.string().nullable().describe('Pose or position of the subject, if applicable.'),
        emotion: z
          .string()
          .nullable()
          .describe('Emotion or expression conveyed by the subject, if applicable.'),
        position: z
          .string()
          .describe('Location of the subject in the image, e.g., center, foreground.'),
        size: z
          .string()
          .describe('Relative size of the subject in the image, e.g., small, medium, large.'),
      })
    )
    .nullable()
    .describe('List of subjects in the image; optional, can be empty if no subject is depicted.'),

  style: z
    .object({
      art_style: z
        .string()
        .describe('Artistic style, e.g., realism, impressionism, fantasy, anime.'),
      color_palette: z
        .string()
        .describe('Preferred color palette, e.g., monochrome, vibrant, pastel.'),
      mood: z.string().describe('Emotional atmosphere or mood of the image, e.g., joyful, eerie.'),
      lighting: z
        .string()
        .describe('Lighting conditions, e.g., natural daylight, dramatic shadows.'),
    })
    .describe('Defines the artistic and visual characteristics of the image.'),

  camera: z
    .object({
      focal_length: z.string().describe('Focal length of the lens, e.g., 35mm, 85mm.'),
      aperture: z.string().describe('Aperture setting, e.g., f/1.8, f/5.6.'),
      angle: z.string().describe("Camera angle, e.g., eye-level, low-angle, bird's-eye view."),
      depth_of_field: z.string().describe('Focus effect, e.g., shallow, deep, blurred background.'),
    })
    .describe('Technical details about the camera and framing of the image.'),
})
