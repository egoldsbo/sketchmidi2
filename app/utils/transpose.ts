export default function transpose(or: number, amount: number): number {
  if (amount > 1) {
    return transpose(transpose(or, 1), amount - 1);
  } else if (amount < -1) {
    return transpose(transpose(or, -1), amount + 1);
  } else if (amount === -1) {
    let note = or % 12;
    switch (note) {
      case 11:
      case 9:
      case 7:
      case 4:
      case 2:
        return or - 2;
      default:
        return or - 1;
    }
  } else if (amount === 1) {
    let note = or % 12;
    switch (note) {
      case 0:
      case 2:
      case 5:
      case 7:
      case 9:
        return or + 2;
      default:
        return or + 1;
    }
  } else {
    return or;
  }
}
