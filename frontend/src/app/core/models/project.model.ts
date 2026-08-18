import { LocalizedText, NamedLink } from '../i18n/localized-text.model';
import { SocialPost } from './social-post.model';

export interface Project {
  id: string;
  slug: string;
  title: LocalizedText;
  tagline?: LocalizedText;
  description?: LocalizedText;
  challenge?: LocalizedText;
  solution?: LocalizedText;
  results?: LocalizedText;
  stack?: string[];
  thumbnail_url?: string;
  /** Screenshot of the live site/app, shown as a preview thumbnail in the projects grid. */
  preview_image_url?: string;
  gallery_urls?: string[];
  demo_url?: string;
  repo_url?: string;
  /** Extra named references when a project spans several live systems (e.g. one platform per named app). */
  links?: NamedLink[];
  /** Curated Instagram/TikTok posts to embed — add/remove entries here to control what shows. */
  socialPosts?: SocialPost[];
  company?: string;
  is_featured: boolean;
  sort_order: number;
  year?: number;
}

