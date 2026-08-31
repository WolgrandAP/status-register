/**
 * IDE.IA — Status Register & Work Timer
 * Pure Vanilla JavaScript Application (Zero framework, zero dependencies)
 */

(function () {
  'use strict';

  // --- Constants & Storage Keys ---
  const STORAGE_KEY = 'status_timer_sessions';

  // --- DOM Elements ---
  const timerDisplay = document.getElementById('timer-display');
  const timerStatusChip = document.getElementById('timer-status-chip');
  const timerStatusText = document.getElementById('timer-status-text');

  // Controls
  const btnStart = document.getElementById('btn-start');
  const btnPause = document.getElementById('btn-pause');
  const btnResume = document.getElementById('btn-resume');
  const btnStop = document.getElementById('btn-stop');
  const btnReset = document.getElementById('btn-reset');

  // Output Card
  const outputCard = document.getElementById('output-card');
  const commandOutput = document.getElementById('command-output');
  const btnCopy = document.getElementById('btn-copy');
  const btnCopyText = document.getElementById('btn-copy-text');

  // Modal & Form
  const modalStatus = document.getElementById('modal-status');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnCancelModal = document.getElementById('btn-cancel-modal');
  const statusForm = document.getElementById('status-form');

  // Form Fields
  const fieldSquad = document.getElementById('field-squad');
  const fieldIssue = document.getElementById('field-issue');
  const fieldModulo = document.getElementById('field-modulo');
  const fieldPercentual = document.getElementById('field-percentual');
  const fieldCategoria = document.getElementById('field-categoria');
  const fieldMinutos = document.getElementById('field-minutos');
  const fieldAtividades = document.getElementById('field-atividades');
  const fieldDueDate = document.getElementById('field-due-date');
  const fieldDataDaily = document.getElementById('field-data-daily');
  const fieldImpedimento = document.getElementById('field-impedimento');

  // Toast
  const toast = document.getElementById('toast');

  // --- State Variables ---
  // timerState: 'IDLE' | 'RUNNING' | 'PAUSED'
  let timerState = 'IDLE';
  let startTime = 0;
  let accumulatedTimeMs = 0;
  let timerIntervalId = null;
  let lastSessionSeconds = 0;
  let currentGeneratedCommand = '';

  // --- Helper Functions ---

  /**
   * Formats total seconds into HH:MM:SS string.
   */
  function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  /**
   * Calculates total elapsed milliseconds with drift compensation.
   */
  function getElapsedMs() {
    if (timerState === 'RUNNING') {
      return accumulatedTimeMs + (Date.now() - startTime);
    }
    return accumulatedTimeMs;
  }

  /**
   * Updates the timer display and state chips.
   */
  function updateTimerDisplay() {
    const elapsedMs = getElapsedMs();
    const totalSeconds = Math.floor(elapsedMs / 1000);
    timerDisplay.textContent = formatTime(totalSeconds);
  }

  /**
   * Updates UI buttons and indicators based on the current state.
   */
  function setTimerState(newState) {
    timerState = newState;

    // Reset status chip classes
    timerStatusChip.className = 'timer-status-chip';

    switch (timerState) {
      case 'IDLE':
        timerStatusChip.classList.add('state-idle');
        timerStatusText.textContent = 'Inativo';
        btnStart.style.display = 'inline-flex';
        btnPause.style.display = 'none';
        btnResume.style.display = 'none';
        btnStop.style.display = 'none';
        btnReset.style.display = 'none';
        break;

      case 'RUNNING':
        timerStatusChip.classList.add('state-running');
        timerStatusText.textContent = 'Em Andamento';
        btnStart.style.display = 'none';
        btnPause.style.display = 'inline-flex';
        btnResume.style.display = 'none';
        btnStop.style.display = 'inline-flex';
        btnReset.style.display = 'none';
        break;

      case 'PAUSED':
        timerStatusChip.classList.add('state-paused');
        timerStatusText.textContent = 'Pausado';
        btnStart.style.display = 'none';
        btnPause.style.display = 'none';
        btnResume.style.display = 'inline-flex';
        btnStop.style.display = 'inline-flex';
        btnReset.style.display = 'inline-flex';
        break;
    }
  }

  // --- Timer Actions ---

  /**
   * Starts the timer from IDLE.
   */
  function startTimer() {
    accumulatedTimeMs = 0;
    startTime = Date.now();
    setTimerState('RUNNING');
    updateTimerDisplay();

    clearInterval(timerIntervalId);
    timerIntervalId = setInterval(updateTimerDisplay, 250);
  }

  /**
   * Pauses the timer without opening modal.
   */
  function pauseTimer() {
    if (timerState !== 'RUNNING') return;

    accumulatedTimeMs += Date.now() - startTime;
    clearInterval(timerIntervalId);
    setTimerState('PAUSED');
    updateTimerDisplay();
  }

  /**
   * Resumes the timer from PAUSED state.
   */
  function resumeTimer() {
    if (timerState !== 'PAUSED') return;

    startTime = Date.now();
    setTimerState('RUNNING');
    updateTimerDisplay();

    clearInterval(timerIntervalId);
    timerIntervalId = setInterval(updateTimerDisplay, 250);
  }

  /**
   * Stops the timer, resets the display, and opens the status modal.
   */
  function stopTimer() {
    const elapsedMs = getElapsedMs();
    lastSessionSeconds = Math.floor(elapsedMs / 1000);

    // Stop and reset timer
    clearInterval(timerIntervalId);
    accumulatedTimeMs = 0;
    setTimerState('IDLE');
    timerDisplay.textContent = '00:00:00';

    // Calculate dedicated minutes (minimum 1 minute if elapsed > 0, default 1)
    let calculatedMinutes = 1;
    if (lastSessionSeconds > 0) {
      calculatedMinutes = Math.max(1, Math.round(lastSessionSeconds / 60));
    }

    // Pre-fill form minutes field and open modal
    fieldMinutos.value = calculatedMinutes;
    openModal();
  }

  /**
   * Resets the timer from PAUSED state.
   */
  function resetTimer() {
    clearInterval(timerIntervalId);
    accumulatedTimeMs = 0;
    setTimerState('IDLE');
    timerDisplay.textContent = '00:00:00';
  }

  // --- Modal & Form Logic ---

  function openModal() {
    // Clear previous error classes
    const formControls = statusForm.querySelectorAll('.input, .select, .textarea');
    formControls.forEach(el => el.classList.remove('error'));

    modalStatus.classList.add('active');
    // Focus first input
    setTimeout(() => {
      fieldSquad.focus();
    }, 100);
  }

  function closeModal() {
    modalStatus.classList.remove('active');
  }

  /**
   * Validates mandatory fields and returns object or null.
   */
  function validateForm() {
    let isValid = true;
    let firstInvalid = null;

    const mandatoryFields = [
      fieldSquad,
      fieldIssue,
      fieldModulo,
      fieldPercentual,
      fieldCategoria,
      fieldMinutos,
      fieldAtividades
    ];

    mandatoryFields.forEach(field => {
      const val = field.value.trim();
      if (!val || (field === fieldMinutos && (isNaN(Number(val)) || Number(val) < 1))) {
        field.classList.add('error');
        isValid = false;
        if (!firstInvalid) firstInvalid = field;
      } else {
        field.classList.remove('error');
      }
    });

    if (!isValid && firstInvalid) {
      firstInvalid.focus();
      showToast('Por favor, preencha todos os campos obrigatórios.');
      return null;
    }

    return {
      squad: fieldSquad.value.trim(),
      issue: fieldIssue.value.trim(),
      modulo: fieldModulo.value.trim(),
      percentual: fieldPercentual.value.trim(),
      categoria: fieldCategoria.value.trim(),
      minutos_dedicados: fieldMinutos.value.trim(),
      atividades: fieldAtividades.value.trim(),
      due_date: fieldDueDate.value.trim(),
      data_daily: fieldDataDaily.value.trim(),
      impedimento: fieldImpedimento.value.trim()
    };
  }

  /**
   * Dynamically formats the /status command message.
   */
  function buildStatusCommand(data) {
    const parts = [
      '/status',
      `squad: ${data.squad}`,
      `issue: ${data.issue}`,
      `modulo: ${data.modulo}`,
      `percentual: ${data.percentual}`,
      `categoria: ${data.categoria}`,
      `minutos_dedicados: ${data.minutos_dedicados}`,
      `atividades: ${data.atividades}`
    ];

    // Append optional fields only when provided
    if (data.due_date) {
      parts.push(`due_date: ${data.due_date}`);
    }
    if (data.impedimento) {
      parts.push(`impedimento: ${data.impedimento}`);
    }
    if (data.data_daily) {
      parts.push(`data_daily: ${data.data_daily}`);
    }

    return parts.join(' ');
  }

  /**
   * Saves the confirmed session to localStorage.
   */
  function persistSession(data, commandText) {
    try {
      const historyJson = localStorage.getItem(STORAGE_KEY);
      const history = historyJson ? JSON.parse(historyJson) : [];

      const sessionRecord = {
        id: 'ses_' + Date.now(),
        createdAt: new Date().toISOString(),
        ...data,
        totalSeconds: lastSessionSeconds,
        generatedCommand: commandText
      };

      history.push(sessionRecord);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Não foi possível persistir no localStorage:', e);
    }
  }

  /**
   * Handles status form submission.
   */
  function handleFormSubmit(e) {
    e.preventDefault();

    const data = validateForm();
    if (!data) return;

    const commandText = buildStatusCommand(data);
    currentGeneratedCommand = commandText;

    // Persist to storage
    persistSession(data, commandText);

    // Display formatted output
    commandOutput.textContent = commandText;
    outputCard.classList.add('active');

    // Close modal
    closeModal();

    // Scroll to output
    outputCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    showToast('Status gerado com sucesso!');
  }

  // --- Clipboard Copy ---

  /**
   * Copies text to clipboard with fallback.
   */
  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers or non-HTTPS
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((resolve, reject) => {
        try {
          const successful = document.execCommand('copy');
          document.body.removeChild(textArea);
          if (successful) resolve();
          else reject(new Error('Falha ao copiar'));
        } catch (err) {
          document.body.removeChild(textArea);
          reject(err);
        }
      });
    }
  }

  function handleCopy() {
    if (!currentGeneratedCommand) return;

    copyToClipboard(currentGeneratedCommand)
      .then(() => {
        btnCopyText.textContent = 'Copiado!';
        btnCopy.style.background = 'var(--green-800)';
        showToast('Comando copiado para a área de transferência!');

        setTimeout(() => {
          btnCopyText.textContent = 'Copiar';
          btnCopy.style.background = '';
        }, 2000);
      })
      .catch((err) => {
        console.error('Erro ao copiar:', err);
        showToast('Erro ao copiar comando. Selecione e copie manualmente.');
      });
  }

  // --- Toast Notification ---
  let toastTimeout = null;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('active');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('active');
    }, 3000);
  }

  // --- Event Listeners ---

  // Timer controls
  btnStart.addEventListener('click', startTimer);
  btnPause.addEventListener('click', pauseTimer);
  btnResume.addEventListener('click', resumeTimer);
  btnStop.addEventListener('click', stopTimer);
  btnReset.addEventListener('click', resetTimer);

  // Modal controls
  btnCloseModal.addEventListener('click', closeModal);
  btnCancelModal.addEventListener('click', closeModal);
  modalStatus.addEventListener('click', (e) => {
    if (e.target === modalStatus) {
      closeModal();
    }
  });

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalStatus.classList.contains('active')) {
      closeModal();
    }
  });

  // Form submission
  statusForm.addEventListener('submit', handleFormSubmit);

  // Remove error highlight on input
  statusForm.querySelectorAll('.input, .select, .textarea').forEach(input => {
    input.addEventListener('input', () => input.classList.remove('error'));
    input.addEventListener('change', () => input.classList.remove('error'));
  });

  // Copy action
  btnCopy.addEventListener('click', handleCopy);

  // Initial State
  setTimerState('IDLE');
})();
