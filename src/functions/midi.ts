export const getByteArrayFromString = ((text: string) => {
  const byteArray = Array.from(text).map(char => char.charCodeAt(0));

  // Calculate checksum
  var checksum = 0x10 + 0x00 + 0x00;
  for (let i = 0; i < byteArray.length; i++) {
    checksum += byteArray[i];
  }

  checksum = (128 - (checksum % 128)) % 128;
  return [
    0xf0, 0x41, 0x10, 0x45, 0x12, 0x10, 0x00, 0x00,
    ...byteArray,
    checksum,
    0xf7
  ];
});
