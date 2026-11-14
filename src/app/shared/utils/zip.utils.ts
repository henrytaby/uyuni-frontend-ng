/**
 * Utilidad de compresión ZIP ligera, nativa y sin dependencias externas.
 * Implementa el estándar PKZIP (v2.0) utilizando Web APIs estándar (Uint8Array, DataView, TextEncoder y Blob).
 * Compatible con Windows Explorer, macOS Archive Utility, Linux unzip y descompresores móviles.
 */

export interface ZipFileEntry {
  name: string;
  data: Uint8Array | ArrayBuffer;
}

/**
 * Calcula el CRC-32 (IEEE 802.3) para la integridad de datos del archivo ZIP.
 */
function crc32(bytes: Uint8Array): number {
  let crc = 0 ^ -1;
  for (const byte of bytes) {
    let c = (crc ^ byte) & 0xff;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ -1) >>> 0;
}

/**
 * Genera un archivo ZIP binario como Blob estándar.
 * Almacena archivos en modo Store (sin compresión adicional de CPU),
 * ideal para imágenes JPG, PNG y WebP que ya están altamente comprimidas.
 *
 * @param files Lista de archivos con nombre y bytes
 * @returns Blob con MIME type 'application/zip'
 */
export function createZipArchive(files: ZipFileEntry[]): Blob {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const centralChunks: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const dataBytes = file.data instanceof Uint8Array ? file.data : new Uint8Array(file.data);
    const crc = crc32(dataBytes);
    const size = dataBytes.byteLength;

    // 1. Local File Header (30 bytes + nombre)
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const view = new DataView(localHeader.buffer);
    view.setUint32(0, 0x04034b50, true);   // Firma de cabecera local
    view.setUint16(4, 20, true);           // Versión mínima requerida (2.0)
    view.setUint16(6, 0x0800, true);       // Flag UTF-8 (bit 11)
    view.setUint16(8, 0, true);            // Método de compresión: Store (0)
    view.setUint16(10, 0, true);           // Hora de modificación DOS
    view.setUint16(12, 0, true);           // Fecha de modificación DOS
    view.setUint32(14, crc, true);         // CRC-32
    view.setUint32(18, size, true);        // Tamaño comprimido
    view.setUint32(22, size, true);        // Tamaño original
    view.setUint16(26, nameBytes.length, true); // Longitud del nombre
    view.setUint16(28, 0, true);           // Longitud del campo extra
    localHeader.set(nameBytes, 30);

    chunks.push(localHeader);
    chunks.push(dataBytes);

    // 2. Central Directory Header (46 bytes + nombre)
    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const cView = new DataView(centralHeader.buffer);
    cView.setUint32(0, 0x02014b50, true);  // Firma de directorio central
    cView.setUint16(4, 20, true);          // Versión creadora
    cView.setUint16(6, 20, true);          // Versión requerida
    cView.setUint16(8, 0x0800, true);      // Flag UTF-8
    cView.setUint16(10, 0, true);          // Método Store
    cView.setUint16(12, 0, true);          // Hora DOS
    cView.setUint16(14, 0, true);          // Fecha DOS
    cView.setUint32(16, crc, true);        // CRC-32
    cView.setUint32(20, size, true);       // Tamaño comprimido
    cView.setUint32(24, size, true);       // Tamaño original
    cView.setUint16(28, nameBytes.length, true);
    cView.setUint16(30, 0, true);          // Extra
    cView.setUint16(32, 0, true);          // Comentario
    cView.setUint16(34, 0, true);          // Número de disco
    cView.setUint16(36, 0, true);          // Atributos internos
    cView.setUint32(38, 0, true);          // Atributos externos
    cView.setUint32(42, offset, true);     // Offset del Local Header
    centralHeader.set(nameBytes, 46);

    centralChunks.push(centralHeader);
    offset += localHeader.length + size;
  }

  const centralSize = centralChunks.reduce((acc, chunk) => acc + chunk.length, 0);

  // 3. End of Central Directory Record (22 bytes)
  const eocd = new Uint8Array(22);
  const eView = new DataView(eocd.buffer);
  eView.setUint32(0, 0x06054b50, true);    // Firma EOCD
  eView.setUint16(4, 0, true);             // Número de este disco
  eView.setUint16(6, 0, true);             // Disco de inicio del directorio
  eView.setUint16(8, files.length, true);  // Entradas en este disco
  eView.setUint16(10, files.length, true); // Total de entradas
  eView.setUint32(12, centralSize, true);  // Tamaño del directorio central
  eView.setUint32(16, offset, true);       // Offset de inicio del directorio
  eView.setUint16(20, 0, true);            // Longitud del comentario

  // Concatenación contigua final en un solo ArrayBuffer para compatibilidad estricta con BlobPart
  const totalZipSize = offset + centralSize + 22;
  const finalZip = new Uint8Array(totalZipSize);
  let writeOffset = 0;

  for (const chunk of chunks) {
    finalZip.set(chunk, writeOffset);
    writeOffset += chunk.length;
  }
  for (const cChunk of centralChunks) {
    finalZip.set(cChunk, writeOffset);
    writeOffset += cChunk.length;
  }
  finalZip.set(eocd, writeOffset);

  return new Blob([finalZip.buffer as ArrayBuffer], { type: 'application/zip' });
}
