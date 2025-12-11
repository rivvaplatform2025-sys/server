// src/common/helpers/slug/slug.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class SlugService {
  /**
   * Generate a basic slug from text
   */
  generate(text: string): string {
    if (!text) return '';

    return text
      .toString()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
      .replace(/\s+/g, '-') // spaces to hyphen
      .replace(/-+/g, '-'); // collapse repeated hyphens
  }

  /**
   * Ensures unique slug by appending -1, -2, etc.
   */
  async generateUnique(
    baseText: string,
    existsFn: (slug: string) => Promise<boolean>,
  ): Promise<string> {
    const slug = this.generate(baseText);
    let uniqueSlug = slug;
    let counter = 1;

    while (await existsFn(uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    return uniqueSlug;
  }
}
