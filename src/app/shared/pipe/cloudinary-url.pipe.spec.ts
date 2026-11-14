import { CloudinaryUrlPipe } from './cloudinary-url.pipe';

describe('CloudinaryUrlPipe', () => {
  let pipe: CloudinaryUrlPipe;

  const rawCloudinaryUrl =
    'https://res.cloudinary.com/novalabs-bo/image/upload/v1794603598/uyuni/products/42/catalog/file_beyfwg.jpg';

  beforeEach(() => {
    pipe = new CloudinaryUrlPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null, undefined, or empty values', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform('   ')).toBe('');
  });

  it('should return original URL if not from Cloudinary', () => {
    const externalUrl = 'https://images.unsplash.com/photo-123456';
    expect(pipe.transform(externalUrl)).toBe(externalUrl);
    expect(pipe.transform('/assets/images/placeholder.webp')).toBe('/assets/images/placeholder.webp');
  });

  it('should apply "card" preset by default', () => {
    const result = pipe.transform(rawCloudinaryUrl);
    expect(result).toBe(
      'https://res.cloudinary.com/novalabs-bo/image/upload/w_400,h_400,c_limit,f_auto,q_auto/v1794603598/uyuni/products/42/catalog/file_beyfwg.jpg'
    );
  });

  it('should apply "thumb" preset correctly', () => {
    const result = pipe.transform(rawCloudinaryUrl, 'thumb');
    expect(result).toBe(
      'https://res.cloudinary.com/novalabs-bo/image/upload/w_100,h_100,c_fill,g_auto,f_auto,q_auto/v1794603598/uyuni/products/42/catalog/file_beyfwg.jpg'
    );
  });

  it('should apply "modal" preset correctly', () => {
    const result = pipe.transform(rawCloudinaryUrl, 'modal');
    expect(result).toBe(
      'https://res.cloudinary.com/novalabs-bo/image/upload/w_800,h_800,c_limit,f_auto,q_auto/v1794603598/uyuni/products/42/catalog/file_beyfwg.jpg'
    );
  });

  it('should apply "zoom" preset correctly', () => {
    const result = pipe.transform(rawCloudinaryUrl, 'zoom');
    expect(result).toBe(
      'https://res.cloudinary.com/novalabs-bo/image/upload/w_1600,c_limit,f_auto,q_auto/v1794603598/uyuni/products/42/catalog/file_beyfwg.jpg'
    );
  });

  it('should be idempotent and not duplicate transformation if already present', () => {
    const alreadyTransformed =
      'https://res.cloudinary.com/novalabs-bo/image/upload/w_100,h_100,c_fill,g_auto,f_auto,q_auto/v1794603598/uyuni/products/42/catalog/file_beyfwg.jpg';
    expect(pipe.transform(alreadyTransformed, 'thumb')).toBe(alreadyTransformed);
    expect(pipe.transform(alreadyTransformed, 'card')).toBe(alreadyTransformed);
  });
});

