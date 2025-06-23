const imageDescribePrompts = {
  v1: `Describe the image in one dense, comma-separated sentence starting with the main subject, then detail the setting (time, place, weather, background, relative scale), composition (camera angle, focal length, aperture, depth of field), lighting (type, direction, quality, color temperature, shadow behavior), color palette and contrast, textures and materials, artistic or photographic style references, overall mood, and finish with aspect ratio and resolution; add negative descriptors if needed; no headings or extra commentary.`,
  v2: `### Image-description schema
You are an expert image-captioning model. Think step-by-step in bullet points, then output one sentence in this exact format:

Subject | Setting | Composition | Lighting | Color palette | Textures | Style | Mood | Aspect ratio | Resolution; Negatives: …

Use 'n/a' if unknown.

Example:
"Sunflower in bloom | dawn field, misty | low-angle shot, 35 mm, f/2.8, shallow DOF | soft warm side light | pastel gold, low contrast | velvety petals | Impressionist | serene | 4:5 | 3000×2400 px; Negatives: blurry, under-exposed"`,
  v3: `### Role
You are a vision expert.

### Task
1. Think briefly to identify:
   • subject   • setting   • composition   • lighting  
   • color palette   • textures   • style refs   • mood  
   • aspect ratio   • resolution   • negatives (optional)

2. Write ONE sentence (≤ 60 words) that:
   • begins with the main subject  
   • follows the order above  
   • separates major clauses with commas  
   • puts aspect ratio and resolution in parentheses at the end  
   • skips any detail you cannot see (do not invent)  
   • appends “; Negative:” only if negatives exist.  
   • contains no headings, labels, or pipes.

### Example  
“Glass of whiskey with ice, indoor bar at dusk, close-up eye-level shot, shallow depth of field f/2.8, warm amber glow from overhead pendant lights, rich brown and gold tones, smooth reflective glass and melting ice, realistic photographic style, relaxed mood (1:1, 768×768px); Negative: harsh shadows.”`,
}

export const imageDescribePromptSystemMessage = imageDescribePrompts.v1
