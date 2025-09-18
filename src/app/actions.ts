'use server';

import { generateContentIdeas, type ContentIdeasInput } from '@/ai/flows/generate-content-ideas';

export async function generateIdeasAction(input: ContentIdeasInput) {
  try {
    const result = await generateContentIdeas(input);
    if (!result || !result.ideas) {
      return { success: false, error: 'No ideas were generated.' };
    }
    return { success: true, data: result.ideas };
  } catch (error) {
    console.error('Error generating content ideas:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to generate ideas: ${errorMessage}` };
  }
}
