function createPdfString(canvases: HTMLCanvasElement[]) {
  const pageIds = canvases.map((_, index) => 3 + index * 3);
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${canvases.length} >>`,
  ];

  canvases.forEach((canvas, index) => {
    const pageId = 3 + index * 3;
    const imageId = pageId + 1;
    const contentId = pageId + 2;
    const imageName = `Im${index}`;
    const imageData = getRawRgbImageData(canvas);
    const content = `q\n${canvas.width} 0 0 ${canvas.height} 0 0 cm\n/${imageName} Do\nQ\n`;

    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${canvas.width} ${canvas.height}] /Resources << /XObject << /${imageName} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`,
      `<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Length ${imageData.length} >>\nstream\n${imageData}\nendstream`,
      `<< /Length ${content.length} >>\nstream\n${content}endstream`,
    );
  });

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return pdf;
}

function getRawRgbImageData(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return '';
  }

  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let imageData = '';

  for (let index = 0; index < data.length; index += 4) {
    const alpha = data[index + 3] / 255;
    const red = Math.round(data[index] * alpha + 255 * (1 - alpha));
    const green = Math.round(data[index + 1] * alpha + 255 * (1 - alpha));
    const blue = Math.round(data[index + 2] * alpha + 255 * (1 - alpha));

    imageData += String.fromCharCode(red, green, blue);
  }

  return imageData;
}

export function createPdfBlob(canvas: HTMLCanvasElement) {
  return createMultiPagePdfBlob([canvas]);
}

export function createMultiPagePdfBlob(canvases: HTMLCanvasElement[]) {
  const pdf = createPdfString(canvases);
  const bytes = new Uint8Array(pdf.length);

  for (let index = 0; index < pdf.length; index += 1) {
    bytes[index] = pdf.charCodeAt(index) & 0xff;
  }

  return new Blob([bytes], { type: 'application/pdf' });
}
