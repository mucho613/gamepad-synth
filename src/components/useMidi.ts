import { Output, WebMidi } from 'webmidi';

export const useMidi = async (): Promise<Output[]> => {
  await WebMidi.enable();
  return WebMidi.outputs;
}
