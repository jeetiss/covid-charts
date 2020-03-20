const batch = fn => {
  let isScheduled;

  const executer = (...args) => {
    isScheduled = true;
    setTimeout(() => {
      isScheduled = false;
      fn(...args);
    });
  };

  return (...args) => {
    if (isScheduled) return;
    executer(...args);
  };
};

export { batch };
