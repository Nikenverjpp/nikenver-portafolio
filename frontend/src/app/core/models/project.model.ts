import { LocalizedText, NamedLink } from '@core/i18n/localized-text.model';
import { SocialPost } from './social-post.model';

export type ProjectCategory = 'erp' | 'ecommerce' | 'website' | 'infrastructure' | 'game';

/** `migrating`: the system runs in production while a rewrite is under way. */
export type ProjectStatus = 'production' | 'migrating' | 'in_progress' | 'pilot';

export const PROJECT_STATUS_LABEL_KEYS: Record<ProjectStatus, string> = {
  production: 'projects.statusProduction',
  migrating: 'projects.statusMigrating',
  in_progress: 'projects.statusInProgress',
  pilot: 'projects.statusPilot',
};

export interface ProjectVideo {
  src: string;
  poster: string;
  title: LocalizedText;
  caption: LocalizedText;
}

export interface ProjectImage {
  src: string;
  width: number;
  height: number;
  alt: LocalizedText;
  caption: LocalizedText;
}

export interface ProjectMetric {
  label: LocalizedText;
  before: LocalizedText;
  after: LocalizedText;
}

export interface ProjectFeatureGroup {
  title: LocalizedText;
  items: LocalizedText[];
}

export interface Project {
  id: string;
  slug: string;
  title: LocalizedText;
  tagline?: LocalizedText;
  /** Meta description, 120-155 characters. */
  seo_description: LocalizedText;
  /** Defaults to SoftwareApplication. Use CreativeWork for a business or a service, not an application. */
  schema_type?: 'CreativeWork';
  description?: LocalizedText;
  challenge?: LocalizedText;
  solution?: LocalizedText;
  results?: LocalizedText;
  /** What the owner did himself. Required whenever someone else shares authorship. */
  contribution?: LocalizedText;
  stack?: string[];
  thumbnail_url?: string;
  /** Screenshot of the live site/app, shown as a preview thumbnail in the projects grid. */
  preview_image_url?: string;
  /** Shown under the hero image when the capture needs explaining. */
  preview_caption?: LocalizedText;
  /** Vertical clips, shown inside a phone frame. */
  videos?: ProjectVideo[];
  gallery?: ProjectImage[];
  /** Measured before and after values. */
  metrics?: ProjectMetric[];
  /** Named lists of what the system does, for parts the prose can't cover. */
  feature_groups?: ProjectFeatureGroup[];
  demo_url?: string;
  /** The live link leads to a login: proof the system exists, not a public demo. */
  requires_login?: boolean;
  repo_url?: string;
  /** Extra named references when a project spans several live systems (e.g. one platform per named app). */
  links?: NamedLink[];
  /** Curated Instagram/TikTok posts to embed — add/remove entries here to control what shows. */
  socialPosts?: SocialPost[];
  company?: string;
  categories: ProjectCategory[];
  status: ProjectStatus;
  /** Last content review (YYYY-MM-DD); feeds the sitemap's lastmod. */
  updated_at: string;
  is_featured: boolean;
  sort_order: number;
  year?: number;
  has_cicd?: boolean;
  cicd?: {
    ci: LocalizedText;
    cd: LocalizedText;
  };
}

