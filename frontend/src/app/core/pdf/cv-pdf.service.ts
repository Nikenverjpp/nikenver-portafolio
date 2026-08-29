import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '@env/environment';
import { ExperienceService } from '@core/api/experience.service';
import { Experience } from '@core/models/experience.model';
import { SKILL_GROUPS, COURSE_GROUPS } from '@core/data/skills.data';
import { Locale } from '@core/i18n/locale.service';
import { UI_STRINGS } from '@core/i18n/translations';

function t(key: string, locale: Locale): string {
  const entry = UI_STRINGS[key];
  return entry ? (entry[locale] ?? entry.es) : key;
}

interface TextRun {
  text: string;
  bold?: boolean;
}

function boldRuns(html: string): TextRun[] {
  const runs: TextRun[] = [];
  const regex = /<b>(.*?)<\/b>/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      runs.push({ text: html.slice(lastIndex, match.index) });
    }
    runs.push({ text: match[1], bold: true });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < html.length) {
    runs.push({ text: html.slice(lastIndex) });
  }
  return runs;
}

function yearRange(exp: Experience, locale: Locale): string {
  const present = locale === 'es' ? 'Presente' : 'Present';
  const end = exp.end_year == null ? present : String(exp.end_year);
  return exp.start_year ? `${exp.start_year} - ${end}` : end;
}

@Injectable({ providedIn: 'root' })
export class CvPdfService {
  private readonly experienceApi = inject(ExperienceService);

  async download(locale: Locale): Promise<void> {
    const experiences = await firstValueFrom(this.experienceApi.list());

    const [{ default: pdfMake }, { default: fontContainer }] = await Promise.all([
      import('pdfmake/build/pdfmake'),
      import('pdfmake/build/fonts/Roboto'),
    ]);
    pdfMake.addVirtualFileSystem(fontContainer.vfs);
    pdfMake.addFonts(fontContainer.fonts);

    const docDefinition = this.buildDocDefinition(locale, experiences);
    await pdfMake.createPdf(docDefinition).download(`nikenver-pulgar-cv-${locale}.pdf`);
  }

  private buildDocDefinition(locale: Locale, experiences: Experience[]): Record<string, unknown> {
    const contact = environment.contact;
    const contactLine = [
      contact.email,
      contact.phoneDisplay,
      contact.linkedin.replace(/^https?:\/\//, ''),
    ].join('  ·  ');

    const summary = (['about.paragraph1', 'about.paragraph2', 'about.paragraph3'] as const).map((key) => ({
      text: boldRuns(t(key, locale)),
      fontSize: 9.5,
      margin: [0, 0, 0, 6] as [number, number, number, number],
    }));

    const experienceBlocks = experiences.map((exp) => ({
      margin: [0, 0, 0, 10] as [number, number, number, number],
      stack: [
        {
          columns: [
            { text: exp.role[locale] ?? exp.role.es, bold: true, fontSize: 11 },
            { text: yearRange(exp, locale), alignment: 'right', color: '#666666', fontSize: 9 },
          ],
        },
        { text: exp.company, italics: true, fontSize: 10, color: '#666666' },
        ...(exp.description
          ? [
              {
                text: boldRuns(exp.description[locale] ?? exp.description.es),
                fontSize: 9.5,
                margin: [0, 2, 0, 0] as [number, number, number, number],
              },
            ]
          : []),
        ...(exp.stack?.length
          ? [
              {
                text: exp.stack.join('  ·  '),
                fontSize: 8.5,
                color: '#0e7fbf',
                margin: [0, 3, 0, 0] as [number, number, number, number],
              },
            ]
          : []),
      ],
    }));

    const skillLines = SKILL_GROUPS.map((group) => ({
      text: `${t(group.titleKey, locale)}: ${group.items.join(', ')}`,
      fontSize: 9.5,
      margin: [0, 2, 0, 0] as [number, number, number, number],
    }));

    const courseBlocks = COURSE_GROUPS.flatMap((group) => [
      { text: t(group.titleKey, locale), bold: true, fontSize: 10, margin: [0, 6, 0, 2] as [number, number, number, number] },
      { ul: group.items.map((item) => item[locale] ?? item.es), fontSize: 9 },
    ]);

    return {
      pageMargins: [40, 40, 40, 40] as [number, number, number, number],
      defaultStyle: { font: 'Roboto', fontSize: 10 },
      styles: {
        name: { fontSize: 20, bold: true },
        eyebrow: { fontSize: 11, color: '#0e7fbf', margin: [0, 2, 0, 0] },
        sectionTitle: { fontSize: 13, bold: true, margin: [0, 14, 0, 6] },
      },
      content: [
        { text: contact.name, style: 'name' },
        { text: t('about.eyebrow', locale), style: 'eyebrow' },
        { text: contactLine, fontSize: 9.5, color: '#444444', margin: [0, 4, 0, 12] },
        ...summary,
        { text: t('shared.experienceTitle', locale), style: 'sectionTitle' },
        ...experienceBlocks,
        { text: t('about.stackTitle', locale), style: 'sectionTitle' },
        ...skillLines,
        { text: t('about.coursesTitle', locale), style: 'sectionTitle' },
        ...courseBlocks,
      ],
    };
  }
}
