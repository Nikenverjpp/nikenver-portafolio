export interface LocalizedText {
  es: string;
  en: string;
}

export interface NamedLink {
  label: LocalizedText;
  url: string;
  preview_image_url?: string;
}
