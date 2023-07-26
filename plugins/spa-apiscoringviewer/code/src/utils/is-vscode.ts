export default function isVSCode() {
  // Of course, this is wrong!
  return window.self !== window.parent;
}
