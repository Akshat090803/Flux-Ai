
// declare module "html2pdf.js" {
//   const html2pdf: any;
//   export default html2pdf;
// }
declare module "html2pdf.js" {
  // interface Html2PdfOptions {
  //   margin?: number | [number, number, number, number];
  //   filename?: string;
  //   image?: { type: string; quality: number };
  //   html2canvas?: { scale: number };
  //   jsPDF?: { unit: string; format: string; orientation: string };
  // }

  export interface Html2PdfOptions   {
    margin: number[];
    filename: string;
    image: {
      type: "jpeg"; // Corrected type here
      quality: number;
    };
    html2canvas: {
      scale: number;
    };
    jsPDF: {
      unit: string;
      format: string;
      orientation: string;
    };
  }

  interface Html2Pdf {
    from(element: Element | string): this;
    set(options: Html2PdfOptions): this;
    save(): Promise<void>;
  }

  const html2pdf: () => Html2Pdf;
  export default html2pdf;
}
