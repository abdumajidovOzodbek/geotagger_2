declare module 'piexifjs' {
  type Rational = [number, number];
  type GPSCoordinate = [Rational, Rational, Rational];

  interface ExifObject {
    '0th': { [key: number]: string | number | Rational | undefined };
    Exif: { [key: number]: string | number | Rational | undefined };
    GPS: { [key: number]: string | number | Rational | GPSCoordinate | undefined };
    '1st': { [key: number]: string | number | Rational | undefined };
    thumbnail: string | null;
  }

  interface GPSIFD {
    GPSLatitude: number;
    GPSLatitudeRef: number;
    GPSLongitude: number;
    GPSLongitudeRef: number;
    GPSAltitude: number;
    GPSAltitudeRef: number;
  }

  interface ImageIFD {
    Make: number;
    Model: number;
    Orientation: number;
    Software: number;
    ImageWidth: number;
    ImageLength: number;
  }

  interface ExifIFD {
    DateTimeOriginal: number;
    DateTimeDigitized: number;
    ExposureTime: number;
    FNumber: number;
    ISOSpeedRatings: number;
    FocalLength: number;
  }

  const piexif: {
    load(data: string): ExifObject;
    dump(exifObj: ExifObject): string;
    insert(exifBytes: string, data: string): string;
    remove(data: string): string;
    GPSIFD: GPSIFD;
    ImageIFD: ImageIFD;
    ExifIFD: ExifIFD;
  };

  export default piexif;
}
