import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/shift-away.css';
import { generate } from './functions';
import { icons, copy, sync } from './elements';

new ClipboardJS('.icon.copy');
const instance = tippy(copy, {
  content: 'Copied to clipboard ✅',
  trigger: 'manual',
  animation: 'shift-away'
});

for (const icon of icons) {
  icon.addEventListener('mouseenter', (e) => {
    e.target.classList.add('has-text-info');
  })
  icon.addEventListener('mouseleave', (e) => {
    e.target.classList.remove('has-text-info');
  })
}

copy.addEventListener('click', () => {
  instance.show();
  const timeout = setTimeout(() => {
    instance.hide();
    clearTimeout(timeout);
  }, 2000);
})

sync.addEventListener('click', generate);