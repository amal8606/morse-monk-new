// src/app/core/seo.service.ts

import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(private titleService: Title, private meta: Meta) {}

  updateMetaTags(seo: SeoData): void {
    if (seo.title) {
      this.titleService.setTitle(seo.title);
      this.meta.updateTag({ name: 'og:title', content: seo.title });
    }

    if (seo.description) {
      this.meta.updateTag({ name: 'description', content: seo.description });
      this.meta.updateTag({ name: 'og:description', content: seo.description });
    }

    if (seo.keywords) {
      this.meta.updateTag({ name: 'keywords', content: seo.keywords });
    }

    if (seo.image) {
      this.meta.updateTag({ name: 'og:image', content: seo.image });
    }

    if (seo.url) {
      this.meta.updateTag({ name: 'og:url', content: seo.url });
    }

    // Default tags
    this.meta.updateTag({ name: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
  }
}
