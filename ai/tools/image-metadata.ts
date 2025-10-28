import probe from "probe-image-size";

export interface ImageMetadata {
  width: number;
  height: number;
  type: string;
  mime: string;
  wUnits: string;
  hUnits: string;
  sizeBytes: number;
  aspectRatio: number;
}

export async function getImageMetadata(url: string): Promise<ImageMetadata> {
  const { width, height, type, mime, wUnits, hUnits } = (await probe(
    url
  )) as unknown as ImageMetadata;

  return {
    width,
    height,
    type,
    mime,
    wUnits,
    hUnits,
    aspectRatio: width / height,
  } as ImageMetadata;
}

export default getImageMetadata;
