declare module 'pdfmake/build/pdfmake' {
  export interface PdfMakeDocument {
    download(filename?: string): Promise<void>;
  }

  export interface PdfMakeStatic {
    addVirtualFileSystem(vfs: Record<string, string>): void;
    addFonts(fonts: Record<string, Record<string, string>>): void;
    createPdf(docDefinition: Record<string, unknown>): PdfMakeDocument;
  }

  const pdfMake: PdfMakeStatic;
  export default pdfMake;
}

declare module 'pdfmake/build/fonts/Roboto' {
  interface RobotoFontContainer {
    vfs: Record<string, string>;
    fonts: Record<string, Record<string, string>>;
  }

  const fontContainer: RobotoFontContainer;
  export default fontContainer;
}
