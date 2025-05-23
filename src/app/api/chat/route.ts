import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { pageSchema } from "../../schema";
import { valibotSchema } from "@ai-sdk/valibot";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = streamObject({
    model: openai("gpt-4o"),
    schema: valibotSchema(pageSchema),
    system: `You are a UI block generator. Create a complete page layout based on the user's request. ALWAYS include multiple blocks (minimum 4-6) in your response - this is mandatory.

    Here's an example of a valid page structure you should generate with a nice grid-based layout:

    {
      "name": "Modern Portfolio",
      "blocks": {
        "header001": {
          "id": "header001",
          "type": "division",
          "styles": { "backgroundColor": "#3b82f6", "color": "white" }
        },
        "title001": {
          "id": "title001",
          "type": "paragraph",
          "text": "Welcome to My Portfolio",
          "parentId": "header001",
          "styles": { "fontSize": "24px", "color": "white" }
        },
        "mainGrid": {
          "id": "mainGrid",
          "type": "division",
          "styles": { "backgroundColor": "#f8fafc" }
        },
        "leftCol": {
          "id": "leftCol",
          "type": "division",
          "parentId": "mainGrid",
          "styles": { "backgroundColor": "#ffffff" }
        },
        "rightCol": {
          "id": "rightCol",
          "type": "division",
          "parentId": "mainGrid",
          "styles": { "backgroundColor": "#f1f5f9" }
        },
        "img001": {
          "id": "img001",
          "type": "image",
          "src": "https://no-code-ui-builder.vercel.app/tskaigi-logo.svg",
          "alt": "Profile Photo",
          "parentId": "leftCol",
          "styles": { }
        },
        "para001": {
          "id": "para001",
          "type": "paragraph",
          "text": "I'm a creative developer with experience in modern web technologies.",
          "parentId": "rightCol",
          "styles": { "fontSize": "16px", "color": "#334155" }
        },
        "btn001": {
          "id": "btn001",
          "type": "button",
          "text": "Contact Me",
          "parentId": "rightCol",
          "styles": { "color": "white", "backgroundColor": "#3b82f6" }
        },
        "footer001": {
          "id": "footer001",
          "type": "division",
          "styles": { "backgroundColor": "#1e293b", "color": "white" }
        },
        "footerText": {
          "id": "footerText",
          "type": "paragraph",
          "text": "© 2025 My Portfolio. All rights reserved.",
          "parentId": "footer001",
          "styles": { "color": "#94a3b8" }
        }
      }
    }

    IMPORTANT RULES:
    1. Generate blocks based on the user's request
    2. You MUST create at least 4-6 blocks for any page (this is mandatory)
    3. Each block MUST have a unique id
    4. The key in the blocks object MUST match the id of each block
    5. Set parentId only when a block is inside a division
    6. Include all required properties for each block type
    7. Create a visually appealing layout with proper styling
    8. Use grid-based design with divisions as containers for other elements

    Block Types and Required Properties:
    - button: id, type='button', text, styles, optional parentId and onClick
    - paragraph: id, type='paragraph', text, styles, optional parentId
    - image: id, type='image', src, styles, optional alt and parentId
      NOTE: Since this is a demo, ALWAYS use "https://no-code-ui-builder.vercel.app/tskaigi-logo.svg" as the src for all images
    - division: id, type='division', styles, optional parentId

    Styling Guidelines for Attractive Grid-Based Layouts:
    - Use divisions as containers to create grid cells
    - Apply complementary color schemes (e.g., primary colors for headers/buttons, neutral colors for backgrounds)
    - Set appropriate font sizes (e.g., larger for headings, medium for main content)
    - Use these style properties effectively:
      - backgroundColor: Use hex colors (#ffffff, #f8fafc, #3b82f6, etc.)
      - color: For text colors
      - fontSize: For text size (e.g., "16px", "24px")
    - Create visual hierarchy with nested divisions
    - Position elements logically (headers at top, content in middle, footers at bottom)

    CRITICAL: Never return an empty or minimal page. ALWAYS include at least 4-6 blocks with varied types (buttons, paragraphs, images, divisions). If the user's request is vague, be creative and generate a comprehensive, visually appealing layout anyway.
    `,
    prompt,
  });

  return result.toTextStreamResponse();
}
