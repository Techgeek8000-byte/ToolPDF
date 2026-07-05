declare module 'mammoth' {
  interface ConvertResult {
    value: string;
    messages: any[];
  }

  interface ConvertImageOptions {
    convertImage?: (element: any) => Promise<any>;
  }

  function extractRawText(
    options: { arrayBuffer: ArrayBuffer },
    imageOptions?: ConvertImageOptions
  ): Promise<ConvertResult>;

  function convertToHtml(
    options: { arrayBuffer: ArrayBuffer },
    imageOptions?: ConvertImageOptions
  ): Promise<ConvertResult>;
}