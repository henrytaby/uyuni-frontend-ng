import { createZipArchive, ZipFileEntry } from './zip.utils';

async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  if (typeof blob.arrayBuffer === 'function') {
    return blob.arrayBuffer();
  }
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(blob);
  });
}

describe('createZipArchive', () => {
  it('should create an empty valid zip blob', async () => {
    const blob = createZipArchive([]);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('application/zip');
    expect(blob.size).toBe(22); // Empty ZIP is just 22 bytes of EOCD
  });

  it('should create a zip blob with one file and correct headers', async () => {
    const entry: ZipFileEntry = {
      name: 'test.txt',
      data: new TextEncoder().encode('Hello Uyuni')
    };

    const blob = createZipArchive([entry]);
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.size).toBeGreaterThan(0);

    const buffer = await blobToArrayBuffer(blob);
    const view = new DataView(buffer);

    // Verify Local File Header signature (0x04034b50)
    expect(view.getUint32(0, true)).toBe(0x04034b50);
  });

  it('should package multiple files with UTF-8 characters and binary data', async () => {
    const files: ZipFileEntry[] = [
      {
        name: '01_portada_proyector_español.jpg',
        data: new Uint8Array([255, 216, 255, 224, 0, 16])
      },
      {
        name: '02_dimensiones.png',
        data: new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])
      }
    ];

    const blob = createZipArchive(files);
    expect(blob.size).toBeGreaterThan(100);

    const buffer = await blobToArrayBuffer(blob);
    const view = new DataView(buffer);

    // First file local header signature
    expect(view.getUint32(0, true)).toBe(0x04034b50);

    // Check EOCD signature at the end
    const eocdOffset = buffer.byteLength - 22;
    expect(view.getUint32(eocdOffset, true)).toBe(0x06054b50);
    // Number of entries should be 2
    expect(view.getUint16(eocdOffset + 8, true)).toBe(2);
    expect(view.getUint16(eocdOffset + 10, true)).toBe(2);
  });
});
