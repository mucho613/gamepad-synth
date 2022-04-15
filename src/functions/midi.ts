// TODO: WebMidi API の例外が出たときは All Notes Off を送って安全に止める

export const stringToSysExBytes = ((text: string) => {
  const dataBytes = Array.from(text).map(char => char.charCodeAt(0));
  const addressBytes = [0x10, 0x00, 0x00];
  return [
    0xf0, 0x41, 0x10, 0x45, 0x12,
    ...addressBytes,
    ...dataBytes,
    calculateChecksum([...addressBytes, ...dataBytes]),
    0xf7
  ];
});

export const bitmapToSysExBytes = (bitmap: boolean[]) => {
  const bitmapNumbered = bitmap.map(value => value ? 1 : 0);
  const dataBytes = [...new Array(64)].map((_, index) => {
    const xOffset = Math.floor(index / 16) * 5;
    const yOffset = (index * 16) % 256;

    if (index <= 48) {
      return (bitmapNumbered[xOffset + yOffset] << 4) |
        (bitmapNumbered[xOffset + yOffset + 1] << 3) |
        (bitmapNumbered[xOffset + yOffset + 2] << 2) |
        (bitmapNumbered[xOffset + yOffset + 3] << 1) |
        (bitmapNumbered[xOffset + yOffset + 4]);
    } else {
      return (bitmapNumbered[yOffset + xOffset] << 4)
    }
  });
  const addressBytes = [0x10, 0x01, 0x00];
  return [
    0xf0, 0x41, 0x10, 0x45, 0x12,
    ...addressBytes,
    ...dataBytes,
    calculateChecksum([...addressBytes, ...dataBytes]),
    0xf7
  ];
}

export const calculateChecksum = ((bytes: number[]): number => {
  // Calculate checksum
  const sum = bytes.reduce((a, b) => a + b);
  return (128 - (sum % 128)) % 128;
})
