export interface IImage {
    id: string;
    urls: {
      full: string;
      raw: string;
      regular: string;
      small: string;
      small_s3: string;
      thumb: string;
    };
    width: number;
    height: number;
    description: string | null;
    blur_hash: string;
    alt_description: string | null
  }