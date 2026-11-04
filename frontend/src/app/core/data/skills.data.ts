import { LocalizedText } from '@core/i18n/localized-text.model';
import { Locale } from '@core/i18n/locale.service';

/** Product names stay plain strings; anything that translates uses LocalizedText. */
export type SkillItem = string | LocalizedText;

export interface SkillGroup {
  titleKey: string;
  items: SkillItem[];
}

export function skillName(item: SkillItem, locale: Locale): string {
  return typeof item === 'string' ? item : (item[locale] ?? item.es);
}

export type CourseItem = LocalizedText;

export interface CourseGroup {
  titleKey: string;
  items: CourseItem[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    titleKey: 'about.skillFrontend',
    items: ['Angular', 'React', 'Next.js', 'Vue.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Bootstrap'],
  },
  {
    titleKey: 'about.skillBackend',
    items: ['Laravel', 'PHP', 'NestJS', '.NET (C#)', 'REST APIs', 'Filament'],
  },
  {
    titleKey: 'about.skillData',
    items: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQL Server'],
  },
  {
    titleKey: 'about.skillIntegrations',
    items: [
      { es: 'API del banco Mercantil', en: 'Mercantil bank API' },
      { es: 'Tasa BCV', en: 'BCV exchange rate' },
      'Resend',
      'SendGrid',
      'Twilio',
      'Web Push (VAPID)',
      'Cloudinary',
    ],
  },
  {
    titleKey: 'about.skillSecurity',
    items: [
      'OWASP Top 10',
      'Rate limiting',
      'RBAC',
      'Row-Level Security',
      { es: '2FA y passkeys', en: '2FA and passkeys' },
      { es: 'Protección contra CSRF e inyección SQL', en: 'CSRF and SQL injection protection' },
      { es: 'Cabeceras de seguridad', en: 'Security headers' },
      { es: 'Auditorías de seguridad', en: 'Security audits' },
    ],
  },
  {
    titleKey: 'about.skillPractices',
    items: [
      { es: 'Normalización de bases de datos', en: 'Database normalization' },
      { es: 'Refactorización', en: 'Refactoring' },
      { es: 'Arquitectura por capas de servicios', en: 'Service layer architecture' },
      { es: 'Migración por patrón strangler', en: 'Strangler pattern migration' },
      { es: 'Pruebas unitarias, de API y de navegador', en: 'Unit, API and browser testing' },
      'CI/CD',
      { es: 'Desarrollo asistido por IA', en: 'AI-assisted development' },
    ],
  },
  {
    titleKey: 'about.skillDevops',
    items: ['Git', 'GitHub Actions', { es: 'Docker (básico)', en: 'Docker (basic)' }, 'Vercel', 'Playwright', 'Sentry'],
  },
  {
    titleKey: 'about.skillInfra',
    items: [{ es: 'Soporte técnico', en: 'Technical support' }, 'cPanel/WHM', 'MikroTik', 'Ubiquiti', 'ADB', 'Bash', 'Python'],
  },
  {
    titleKey: 'about.skillOther',
    items: ['WordPress', 'Elementor', 'WooCommerce', 'Prompt Engineering', 'Claude Code'],
  },
  {
    titleKey: 'about.skillFragrance',
    items: [
      { es: 'Diagnóstico olfativo', en: 'Olfactory diagnosis' },
      { es: 'Layering de fragancias', en: 'Fragrance layering' },
      { es: 'Matching de perfumes', en: 'Perfume matching' },
      { es: 'Familias olfativas', en: 'Olfactory families' },
    ],
  },
];

export const COURSE_GROUPS: CourseGroup[] = [
  {
    titleKey: 'about.skillFrontend',
    items: [
      {
        es: 'Angular desde Cero a Experto: Crear una Aplicación Real',
        en: 'Angular from Scratch to Expert: Build a Real App',
      },
      { es: 'React: de Cero a Experto (Hooks y MERN)', en: 'React: From Scratch to Expert (Hooks & MERN)' },
      { es: 'Curso Profesional de JavaScript', en: 'Professional JavaScript Course' },
    ],
  },
  {
    titleKey: 'about.skillBackend',
    items: [
      {
        es: 'Aprende a Crear una Plataforma de Cursos con Laravel',
        en: 'Learn to Build a Course Platform with Laravel',
      },
      {
        es: 'Desarrollo Web en PHP con Laravel 5.6, VueJS y MariaDB MySQL',
        en: 'Web Development in PHP with Laravel 5.6, VueJS and MariaDB MySQL',
      },
      {
        es: 'Curso de Laravel y Livewire - Crea un Sistema de Parking',
        en: 'Laravel and Livewire Course - Build a Parking System',
      },
      {
        es: 'Construyendo Web APIs RESTful con ASP.NET Core 6',
        en: 'Building RESTful Web APIs with ASP.NET Core 6',
      },
      { es: 'Curso de Refactorización con PHP', en: 'PHP Refactoring Course' },
      { es: 'Curso de Laravel 10 desde Cero', en: 'Laravel 10 From Scratch' },
    ],
  },
  {
    titleKey: 'about.skillOther',
    items: [
      { es: 'Diplomado: Webmaster', en: 'Diploma: Webmaster' },
      { es: 'Diplomado: Diseño de Medios Web', en: 'Diploma: Web Media Design' },
      {
        es: 'Diseño Gráfico, Edición de Video y Programación Web con IA (2026)',
        en: 'Graphic Design, Video Editing and Web Programming with AI (2026)',
      },
      {
        es: 'Diplomado Internacional en Marketing Digital con IA (2026)',
        en: 'International Diploma in Digital Marketing with AI (2026)',
      },
    ],
  },
];
