import { DEFAULT_PASSWORD_LENGTH } from './config';
import {
  trigger,
  settingsPanel,
  pwdLengthInput,
  checkboxes,
  generateBtn,
  historyBtn,
  historyContainer,
  template
} from './elements';
import { generate, getHistory } from './functions';

// Trigger
trigger.addEventListener('mouseenter', (e) => {
  e.target.classList.add('has-text-info');
})
trigger.addEventListener('mouseleave', (e) => {
  e.target.classList.remove('has-text-info');
})
trigger.addEventListener('click', () => {
  settingsPanel.classList.toggle('is-hidden');
  const icon = document.querySelector('.trigger span.icon .caret');
  if (icon.getAttribute('data-icon') === 'caret-down') {
    icon.setAttribute('data-icon', 'caret-up');
  } else {
    icon.setAttribute('data-icon', 'caret-down');
  }
})

// Settings
pwdLengthInput.value = DEFAULT_PASSWORD_LENGTH;

for (const checkbox of checkboxes) {
  checkbox.checked = true;
}

generateBtn.addEventListener('click', generate);

historyBtn.addEventListener('click', () => {
  if (!historyContainer.classList.contains('is-hidden')) {
    historyContainer.classList.add('is-hidden');
    return;
  }

  getHistory().then(history => {
    while (historyContainer.firstChild) {
      historyContainer.removeChild(historyContainer.lastChild);
    }
    
    historyContainer.classList.remove('is-hidden');

    for (const item of history) {
      const clone = template.content.cloneNode(true);
      const date = clone.querySelector('._date');
      const pwd = clone.querySelector('._pwd');
      date.textContent = item.date;
      pwd.textContent = item.pwd;
      historyContainer.appendChild(clone);
    }
  })
})