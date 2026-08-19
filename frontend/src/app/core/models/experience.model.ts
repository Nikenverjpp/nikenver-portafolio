import { LocalizedText, NamedLink } from '@core/i18n/localized-text.model';

export interface Experience {
  id: string;
  company: string;
  company_url?: string;
  role: LocalizedText;
  description?: LocalizedText;
  detail?: LocalizedText;
  stack?: string[];
  start_year?: number;
  end_year?: number | null;
  logo_url?: string;
  links?: NamedLink[];
  sort_order: number;
}

