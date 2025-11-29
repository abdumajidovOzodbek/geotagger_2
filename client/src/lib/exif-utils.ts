import piexif from 'piexifjs';

export interface ExifData {
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  dateTaken: string | null;
  make: string | null;
  model: string | null;
  orientation: number | null;
  software: string | null;
  exposureTime: string | null;
  fNumber: string | null;
  iso: number | null;
  focalLength: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  allTags: Record<string, string>;
}

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
}

type Rational = [number, number];
type GPSCoordinate = [Rational, Rational, Rational];

function convertDMSToDD(dms: number[], ref: string): number {
  const degrees = dms[0];
  const minutes = dms[1];
  const seconds = dms[2];
  let dd = degrees + minutes / 60 + seconds / 3600;
  if (ref === 'S' || ref === 'W') {
    dd = dd * -1;
  }
  return dd;
}

function convertDDToDMS(dd: number): [number, number, number] {
  const absDD = Math.abs(dd);
  const degrees = Math.floor(absDD);
  const minutesFloat = (absDD - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;
  return [degrees, minutes, seconds];
}

function formatRational(rational: Rational | undefined): string | null {
  if (!rational) return null;
  if (rational[1] === 0) return null;
  return (rational[0] / rational[1]).toString();
}

function formatExposureTime(rational: Rational | undefined): string | null {
  if (!rational) return null;
  if (rational[1] === 0) return null;
  const value = rational[0] / rational[1];
  if (value >= 1) {
    return `${value}s`;
  }
  return `1/${Math.round(1 / value)}s`;
}

function isRational(val: unknown): val is Rational {
  return Array.isArray(val) && val.length === 2 && typeof val[0] === 'number' && typeof val[1] === 'number';
}

function isGPSCoordinate(val: unknown): val is GPSCoordinate {
  return Array.isArray(val) && val.length === 3 && 
    isRational(val[0]) && isRational(val[1]) && isRational(val[2]);
}

export function readExifFromBase64(base64Data: string): ExifData {
  const result: ExifData = {
    latitude: null,
    longitude: null,
    altitude: null,
    dateTaken: null,
    make: null,
    model: null,
    orientation: null,
    software: null,
    exposureTime: null,
    fNumber: null,
    iso: null,
    focalLength: null,
    imageWidth: null,
    imageHeight: null,
    allTags: {},
  };

  try {
    const exifObj = piexif.load(base64Data);

    // GPS data
    if (exifObj.GPS) {
      const gps = exifObj.GPS;
      
      const lat = gps[piexif.GPSIFD.GPSLatitude];
      const latRef = gps[piexif.GPSIFD.GPSLatitudeRef];
      if (isGPSCoordinate(lat) && typeof latRef === 'string') {
        result.latitude = convertDMSToDD(
          [lat[0][0] / lat[0][1], lat[1][0] / lat[1][1], lat[2][0] / lat[2][1]],
          latRef
        );
      }

      const lng = gps[piexif.GPSIFD.GPSLongitude];
      const lngRef = gps[piexif.GPSIFD.GPSLongitudeRef];
      if (isGPSCoordinate(lng) && typeof lngRef === 'string') {
        result.longitude = convertDMSToDD(
          [lng[0][0] / lng[0][1], lng[1][0] / lng[1][1], lng[2][0] / lng[2][1]],
          lngRef
        );
      }

      const alt = gps[piexif.GPSIFD.GPSAltitude];
      const altRef = gps[piexif.GPSIFD.GPSAltitudeRef];
      if (isRational(alt)) {
        result.altitude = alt[0] / alt[1];
        if (altRef === 1) {
          result.altitude = -result.altitude;
        }
      }
    }

    // 0th IFD (Image) data
    if (exifObj['0th']) {
      const zeroth = exifObj['0th'];
      const make = zeroth[piexif.ImageIFD.Make];
      const model = zeroth[piexif.ImageIFD.Model];
      const orientation = zeroth[piexif.ImageIFD.Orientation];
      const software = zeroth[piexif.ImageIFD.Software];
      const imageWidth = zeroth[piexif.ImageIFD.ImageWidth];
      const imageHeight = zeroth[piexif.ImageIFD.ImageLength];

      result.make = typeof make === 'string' ? make : null;
      result.model = typeof model === 'string' ? model : null;
      result.orientation = typeof orientation === 'number' ? orientation : null;
      result.software = typeof software === 'string' ? software : null;
      result.imageWidth = typeof imageWidth === 'number' ? imageWidth : null;
      result.imageHeight = typeof imageHeight === 'number' ? imageHeight : null;

      // Add to allTags
      if (result.make) result.allTags['Make'] = result.make;
      if (result.model) result.allTags['Model'] = result.model;
      if (result.orientation) result.allTags['Orientation'] = result.orientation.toString();
      if (result.software) result.allTags['Software'] = result.software;
    }

    // Exif IFD data
    if (exifObj.Exif) {
      const exif = exifObj.Exif;
      const dateOriginal = exif[piexif.ExifIFD.DateTimeOriginal];
      const dateDigitized = exif[piexif.ExifIFD.DateTimeDigitized];
      const exposureTime = exif[piexif.ExifIFD.ExposureTime];
      const fNumber = exif[piexif.ExifIFD.FNumber];
      const iso = exif[piexif.ExifIFD.ISOSpeedRatings];
      const focalLength = exif[piexif.ExifIFD.FocalLength];

      result.dateTaken = (typeof dateOriginal === 'string' ? dateOriginal : null) || 
                         (typeof dateDigitized === 'string' ? dateDigitized : null);
      result.exposureTime = isRational(exposureTime) ? formatExposureTime(exposureTime) : null;
      result.fNumber = isRational(fNumber) ? formatRational(fNumber) : null;
      result.iso = typeof iso === 'number' ? iso : null;
      result.focalLength = isRational(focalLength) ? formatRational(focalLength) : null;

      // Add to allTags
      if (result.dateTaken) result.allTags['Date Taken'] = result.dateTaken;
      if (result.exposureTime) result.allTags['Exposure Time'] = result.exposureTime;
      if (result.fNumber) result.allTags['F-Number'] = `f/${result.fNumber}`;
      if (result.iso) result.allTags['ISO'] = result.iso.toString();
      if (result.focalLength) result.allTags['Focal Length'] = `${result.focalLength}mm`;
    }

    // Add GPS to allTags
    if (result.latitude !== null) result.allTags['Latitude'] = result.latitude.toFixed(6);
    if (result.longitude !== null) result.allTags['Longitude'] = result.longitude.toFixed(6);
    if (result.altitude !== null) result.allTags['Altitude'] = `${result.altitude.toFixed(1)}m`;

  } catch (err) {
    console.log('No EXIF data found or error reading EXIF:', err);
  }

  return result;
}

export function writeGpsToImage(base64Data: string, coords: GpsCoordinates): string {
  let exifObj;
  
  try {
    exifObj = piexif.load(base64Data);
  } catch {
    exifObj = { '0th': {}, Exif: {}, GPS: {}, '1st': {}, thumbnail: null };
  }

  // Ensure GPS object exists
  if (!exifObj.GPS) {
    exifObj.GPS = {};
  }

  // Convert latitude
  const latDMS = convertDDToDMS(coords.latitude);
  exifObj.GPS[piexif.GPSIFD.GPSLatitude] = [
    [Math.round(latDMS[0] * 10000), 10000],
    [Math.round(latDMS[1] * 10000), 10000],
    [Math.round(latDMS[2] * 10000), 10000],
  ] as GPSCoordinate;
  exifObj.GPS[piexif.GPSIFD.GPSLatitudeRef] = coords.latitude >= 0 ? 'N' : 'S';

  // Convert longitude
  const lngDMS = convertDDToDMS(coords.longitude);
  exifObj.GPS[piexif.GPSIFD.GPSLongitude] = [
    [Math.round(lngDMS[0] * 10000), 10000],
    [Math.round(lngDMS[1] * 10000), 10000],
    [Math.round(lngDMS[2] * 10000), 10000],
  ] as GPSCoordinate;
  exifObj.GPS[piexif.GPSIFD.GPSLongitudeRef] = coords.longitude >= 0 ? 'E' : 'W';

  // Set altitude if provided
  if (coords.altitude !== undefined) {
    const absAltitude = Math.abs(coords.altitude);
    exifObj.GPS[piexif.GPSIFD.GPSAltitude] = [Math.round(absAltitude * 100), 100] as Rational;
    exifObj.GPS[piexif.GPSIFD.GPSAltitudeRef] = coords.altitude >= 0 ? 0 : 1;
  }

  // Convert back to binary and insert
  const exifBytes = piexif.dump(exifObj);
  const newBase64 = piexif.insert(exifBytes, base64Data);

  return newBase64;
}

export function removeGpsFromImage(base64Data: string): string {
  let exifObj;
  
  try {
    exifObj = piexif.load(base64Data);
  } catch {
    return base64Data;
  }

  // Remove GPS data
  exifObj.GPS = {};

  // Convert back to binary and insert
  const exifBytes = piexif.dump(exifObj);
  const newBase64 = piexif.insert(exifBytes, base64Data);

  return newBase64;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function base64ToBlob(base64: string): Blob {
  const parts = base64.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
