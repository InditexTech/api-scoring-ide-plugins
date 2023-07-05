export default function isVsCode() {
  // Of course, this is wrong!
  return window.self !== window.parent;
}
