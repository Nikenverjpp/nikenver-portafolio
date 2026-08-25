import { LocalizedText } from '@core/i18n/localized-text.model';

export interface Service {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  icon: string;
  relatedProjectSlugs?: string[];
  sort_order: number;
}
