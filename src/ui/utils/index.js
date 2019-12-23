export const promisifySetState = setState => newState => {
  return new Promise(resolve => {
    setState(newState, resolve);
  });
}