import { DEFAULT_OPTIONS } from './config';
import {
  pwdLengthInput,
  checkboxes,
  input,
  historyContainer,
  template
} from './elements';
import EventEmitter from 'events';

function _buildOptions() {
  const options = {};
  if (pwdLengthInput.value) {
    options.length = pwdLengthInput.value;
  }
  for (const checkbox of checkboxes) {
    const id = checkbox.dataset.id;
    options[id] = checkbox.checked;
  }
  return options;
}


export const emitter = new EventEmitter();

export function generate() {
  const qs = new URLSearchParams(
    Object.assign(
      DEFAULT_OPTIONS,
      _buildOptions()
    )
  );
  return fetch(`/.netlify/functions/generate?${qs}`)
    .then(res => res.text())
    .then(pwd => {
      input.value = pwd;
      emitter.emit('password');
    })
    .catch(error => {
      console.error(error)
    })
}

export function getHistory() {
  return fetch('/.netlify/functions/history')
    .then(r => r.json())
    .then(history => {
      while (historyContainer.firstChild) {
        historyContainer.removeChild(historyContainer.lastChild);
      }

      for (const item of history) {
        const clone = template.content.cloneNode(true);
        const date = clone.querySelector('._date');
        const pwd = clone.querySelector('._pwd');
        date.textContent = item.date;
        pwd.textContent = item.pwd;
        historyContainer.appendChild(clone);
      }
    })
    .catch(error => {
      console.error(error);
    });
}