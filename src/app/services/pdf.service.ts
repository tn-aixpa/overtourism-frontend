

  import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  async downloadPdfFromElement(elementId: string, filename: string): Promise<void> {
    const DATA = document.getElementById(elementId);
    if (!DATA) throw new Error(`Elemento con id "${elementId}" non trovato.`);

    // 🔹 Escludi elementi marcati come "exclude-from-pdf"
    const excludedElements = Array.from(DATA.querySelectorAll('.exclude-from-pdf')) as HTMLElement[];
    excludedElements.forEach(el => {
      const computedDisplay = window.getComputedStyle(el).display;
      el.setAttribute('data-original-display', computedDisplay);
      el.style.display = 'none';
    });

    try {
      const canvas = await html2canvas(DATA, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

      const title = filename.replace(/\.pdf$/i, '');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text(title, pageWidth / 2, 15, { align: 'center' });

      const topMargin = 25;
      pdf.addImage(imgData, 'PNG', 0, topMargin, pageWidth, pdfHeight);

      // 🔹 Salva il file
      pdf.save(filename);
    } catch (err) {
      console.error('Errore nella generazione PDF:', err);
      throw err;
    } finally {
      // 🔹 Ripristina elementi nascosti
      excludedElements.forEach(el => {
        el.style.display = el.getAttribute('data-original-display') || '';
        el.removeAttribute('data-original-display');
      });
    }
  }
}

