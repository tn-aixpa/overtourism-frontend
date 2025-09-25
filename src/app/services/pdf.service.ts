import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  downloadPdfFromElement(elementId: string, filename: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const DATA = document.getElementById(elementId);
      if (!DATA) return reject();
  
      const excludedElements = Array.from(DATA.querySelectorAll('.exclude-from-pdf')) as HTMLElement[];
      excludedElements.forEach(el => {
        const computedDisplay = window.getComputedStyle(el).display;
        el.setAttribute('data-original-display', computedDisplay);
        el.style.display = 'none';
      });
  
      html2canvas(DATA, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;
  
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pdfHeight);
        pdf.save(filename);
  
        excludedElements.forEach(el => {
          el.style.display = el.getAttribute('data-original-display') || '';
          el.removeAttribute('data-original-display');
        });
  
        resolve();
      }).catch(err => {
        console.error('Errore nella generazione PDF:', err);
        excludedElements.forEach(el => {
          el.style.display = el.getAttribute('data-original-display') || '';
          el.removeAttribute('data-original-display');
        });
        reject(err);
      });
    });
  }
  
}
