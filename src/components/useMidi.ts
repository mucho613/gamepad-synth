import { Output, WebMidi } from 'webmidi';

export const useMidi = async (): Promise<Output[]> => {
  await WebMidi.enable({
    sysex: true
  });
  return WebMidi.outputs;
}
