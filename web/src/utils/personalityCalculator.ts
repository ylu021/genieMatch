const getIntrovertLabel = (score: number) => {
  if (score < 50) {
    return 'Introvert';
  } else if (score === 50) {
    return 'Ambivert';
  }
  return 'Extravert';
};

const getPracticalLabel = (score: number) => {
  if (score < 50) {
    return 'practical';
  } else if (score === 50) {
    return 'blend of Practical & Imaginative';
  }
  return 'Imaginative';
};

const getLogicalLabel = (score: number) => {
  if (score < 50) {
    return 'logical';
  } else if (score === 50) {
    return 'blend of Logical & Emotional';
  }
  return 'emotional';
};

const getStructuredLabel = (score: number) => {
  if (score < 50) {
    return 'Structured';
  } else if (score === 50) {
    return 'blend of Structured & Flexible';
  }
  return 'Flexible';
};

export default {
  getIntrovertLabel,
  getPracticalLabel,
  getLogicalLabel,
  getStructuredLabel,
};

