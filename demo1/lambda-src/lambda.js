exports.handler = async (event) => {
  const now = new Date();
  console.log(`event view1 [now: ${now.toISOString()}]`);
  console.log(`event view2 [now: ${now.toISOString()}, event.time: ${event.time}]`);
  if (Math.random() >= 0.9) { // 10 % chance
    throw new Error('something went wrong');
  }
  return {};
};
