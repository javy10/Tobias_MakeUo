// src/ai/flows/generate-content-ideas.ts
'use server';

/**
 * @fileOverview AI-powered tool to generate content ideas for different sections of the website.
 *
 * - generateContentIdeas - A function that generates content ideas for a specified section.
 * - ContentIdeasInput - The input type for the generateContentIdeas function.
 * - ContentIdeasOutput - The return type for the generateContentIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentIdeasInputSchema = z.object({
  section: z
    .enum(['hero', 'services', 'gallery', 'testimonials'])
    .describe('The section of the website to generate content ideas for.'),
  topic: z
    .string()
    .optional()
    .describe('The main topic or theme for the content ideas.'),
});
export type ContentIdeasInput = z.infer<typeof ContentIdeasInputSchema>;

const ContentIdeasOutputSchema = z.object({
  ideas: z
    .array(z.string())
    .describe('An array of content ideas for the specified section.'),
});
export type ContentIdeasOutput = z.infer<typeof ContentIdeasOutputSchema>;

export async function generateContentIdeas(input: ContentIdeasInput): Promise<ContentIdeasOutput> {
  return generateContentIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentIdeasPrompt',
  input: {schema: ContentIdeasInputSchema},
  output: {schema: ContentIdeasOutputSchema},
  prompt: `You are a creative marketing assistant helping a makeup studio populate their website with content.

  Generate 3 content ideas for the {{section}} section of the website.

  The ideas should be short, engaging, and relevant to the makeup industry.

  {{#if topic}}
  The content ideas should be related to the topic: {{topic}}.
  {{/if}}

  The content ideas should be distinct from each other.

  Output the ideas as a numbered list.
  `,
});

const generateContentIdeasFlow = ai.defineFlow(
  {
    name: 'generateContentIdeasFlow',
    inputSchema: ContentIdeasInputSchema,
    outputSchema: ContentIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      ideas: output!.ideas,
    };
  }
);
