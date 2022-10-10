import { render } from './01 fundamentals';

(() => {
  const canvas = document.querySelector('canvas');
  const gl = canvas?.getContext('webgl');

  if (!canvas || !gl) return;

  render(gl);
})();
