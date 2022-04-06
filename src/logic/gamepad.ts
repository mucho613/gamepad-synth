
export const getButtonNameByButtonIndex = (index: number) => {
  switch (index) {
    case 0:
      return 'A';
    case 1:
      return 'B';
    case 2:
      return 'X';
    case 3:
      return 'Y';
    case 4:
      return 'LB';
    case 5:
      return 'RB';
    case 6:
      return 'LT';
    case 7:
      return 'RT';
    case 8:
      return 'Back';
    case 9:
      return 'Start';
    case 10:
      return 'Left Stick Press';
    case 11:
      return 'Right Stick Press';
    case 12:
      return 'D-Pad Up';
    case 13:
      return 'D-Pad Down';
    case 14:
      return 'D-Pad Left';
    case 15:
      return 'D-Pad Right';
    case 16:
      return 'Home';
    default:
      return 'unknown';
  }
}

export const getBaseNoteNumberByButtonIndex = (index: number) => {
  switch (index) {
    case 13:
      return 0;
    case 14:
      return 2;
    case 12:
      return 4;
    case 15:
      return 5;
    case 2:
      return 7;
    case 0:
      return 9;
    case 1:
      return 11;
    case 3:
      return 12;
    default:
      return null;
  }
}
