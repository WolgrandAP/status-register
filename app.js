/**
 * IDE.IA — Status Register & Work Timer + Daily History
 * Pure Vanilla JavaScript Application (Zero framework, zero dependencies)
 */

(function () {
  'use strict';

  // --- Constants & Storage Keys ---
  const STORAGE_KEY = 'status_timer_sessions';

  // --- DOM Elements ---

  // Navigation Tabs & Views
  const tabTimer = document.getElementById('tab-timer');
  const tabHistory = document.getElementById('tab-history');
  const viewTimer = document.getElementById('view-timer');
  const viewHistory = document.getElementById('view-history');
  const btnGoToTimer = document.getElementById('btn-go-to-timer');

  // Timer Display & Chips
  const timerDisplay = document.getElementById('timer-display');
  const timerStatusChip = document.getElementById('timer-status-chip');
  const timerStatusText = document.getElementById('timer-status-text');

  // Timer Controls
  const btnStart = document.getElementById('btn-start');
  const btnPause = document.getElementById('btn-pause');
  const btnResume = document.getElementById('btn-resume');
  const btnStop = document.getElementById('btn-stop');
  const btnReset = document.getElementById('btn-reset');

  // Output Card (Timer View)
  const outputCard = document.getElementById('output-card');
  const commandOutput = document.getElementById('command-output');
  const btnCopy = document.getElementById('btn-copy');
  const btnCopyText = document.getElementById('btn-copy-text');

  // Modal & Status Form
  const modalStatus = document.getElementById('modal-status');
  const modalTitle = document.getElementById('modal-title');
  const modalEyebrow = modalStatus.querySelector('.eyebrow');
  const btnSubmitStatus = document.getElementById('btn-submit-status');
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

  // History View Elements
  const btnPrevDay = document.getElementById('btn-prev-day');
  const btnNextDay = document.getElementById('btn-next-day');
  const btnToday = document.getElementById('btn-today');
  const historyDatePicker = document.getElementById('history-date-picker');
  const historyDailySummary = document.getElementById('history-daily-summary');
  const historyList = document.getElementById('history-list');
  const historyEmpty = document.getElementById('history-empty');

  // Toast Notification
  const toast = document.getElementById('toast');

  // --- State Variables ---

  // Timer State: 'IDLE' | 'RUNNING' | 'PAUSED'
  let timerState = 'IDLE';
  let startTime = 0;
  let accumulatedTimeMs = 0;
  let timerIntervalId = null;
  let lastSessionSeconds = 0;
  let currentGeneratedCommand = '';

  // Modal mode: null = new session, string = id of session being edited
  let editingSessionId = null;

  // History State
  let currentSelectedDate = formatDateToISO(new Date());

  // --- Helper Functions ---

  /**
   * Formats a Date object into YYYY-MM-DD string in local time.
   */
  function formatDateToISO(d) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Formats ISO timestamp string to HH:MM in local time.
   */
  function formatTimeOfDay(isoString) {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch {
      return '';
    }
  }

  /**
   * Formats minutes into hours and minutes text (e.g., "1h 30m" or "45m").
   */
  function formatMinutesTotal(totalMinutes) {
    const mins = Number(totalMinutes) || 0;
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }

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
   * Updates the timer display text.
   */
  function updateTimerDisplay() {
    const elapsedMs = getElapsedMs();
    const totalSeconds = Math.floor(elapsedMs / 1000);
    timerDisplay.textContent = formatTime(totalSeconds);
  }

  /**
   * Escapes HTML characters for safe rendering.
   */
  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Tab Navigation Manager ---

  function switchTab(target) {
    if (target === 'timer') {
      tabTimer.classList.add('active');
      tabTimer.setAttribute('aria-selected', 'true');
      tabHistory.classList.remove('active');
      tabHistory.setAttribute('aria-selected', 'false');

      viewTimer.classList.add('active');
      viewHistory.classList.remove('active');
    } else if (target === 'history') {
      tabHistory.classList.add('active');
      tabHistory.setAttribute('aria-selected', 'true');
      tabTimer.classList.remove('active');
      tabTimer.setAttribute('aria-selected', 'false');

      viewHistory.classList.add('active');
      viewTimer.classList.remove('active');

      renderHistory();
    }
  }

  // --- Timer Controls & State Machine ---

  function setTimerState(newState) {
    timerState = newState;

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

  function startTimer() {
    accumulatedTimeMs = 0;
    startTime = Date.now();
    setTimerState('RUNNING');
    updateTimerDisplay();

    clearInterval(timerIntervalId);
    timerIntervalId = setInterval(updateTimerDisplay, 250);
  }

  function pauseTimer() {
    if (timerState !== 'RUNNING') return;

    accumulatedTimeMs += Date.now() - startTime;
    clearInterval(timerIntervalId);
    setTimerState('PAUSED');
    updateTimerDisplay();
  }

  function resumeTimer() {
    if (timerState !== 'PAUSED') return;

    startTime = Date.now();
    setTimerState('RUNNING');
    updateTimerDisplay();

    clearInterval(timerIntervalId);
    timerIntervalId = setInterval(updateTimerDisplay, 250);
  }

  function stopTimer() {
    const elapsedMs = getElapsedMs();
    lastSessionSeconds = Math.floor(elapsedMs / 1000);

    clearInterval(timerIntervalId);
    accumulatedTimeMs = 0;
    setTimerState('IDLE');
    timerDisplay.textContent = '00:00:00';

    let calculatedMinutes = 1;
    if (lastSessionSeconds > 0) {
      calculatedMinutes = Math.max(1, Math.round(lastSessionSeconds / 60));
    }

    fieldMinutos.value = calculatedMinutes;
    openModal();
  }

  function resetTimer() {
    clearInterval(timerIntervalId);
    accumulatedTimeMs = 0;
    setTimerState('IDLE');
    timerDisplay.textContent = '00:00:00';
  }

  // --- Modal & Form Handlers ---

  /**
   * Opens the modal in "new session" mode.
   * Clears error states; does NOT reset field values
   * (they were set by stopTimer before calling this).
   */
  function openModal() {
    editingSessionId = null;
    modalEyebrow.textContent = 'Encerramento de Sessão';
    modalTitle.textContent = 'Registrar Status de Trabalho';
    btnSubmitStatus.textContent = 'Gerar Status';

    const formControls = statusForm.querySelectorAll('.input, .select, .textarea');
    formControls.forEach(el => el.classList.remove('error'));

    modalStatus.classList.add('active');
    setTimeout(() => { fieldSquad.focus(); }, 100);
  }

  /**
   * Opens the modal in "edit session" mode.
   * Pre-fills all fields with the existing session's data.
   */
  function openModalForEdit(session) {
    editingSessionId = session.id;
    modalEyebrow.textContent = 'Histórico';
    modalTitle.textContent = 'Editar Status de Trabalho';
    btnSubmitStatus.textContent = 'Salvar Alterações';

    // Populate fields
    fieldSquad.value = session.squad || '';
    fieldIssue.value = session.issue || '';
    fieldModulo.value = session.modulo || '';
    fieldPercentual.value = session.percentual || '';
    fieldCategoria.value = session.categoria || '';
    fieldMinutos.value = session.minutos_dedicados || '';
    fieldAtividades.value = session.atividades || '';
    fieldDueDate.value = session.due_date || '';
    fieldDataDaily.value = session.data_daily || '';
    fieldImpedimento.value = session.impedimento || '';

    const formControls = statusForm.querySelectorAll('.input, .select, .textarea');
    formControls.forEach(el => el.classList.remove('error'));

    modalStatus.classList.add('active');
    setTimeout(() => { fieldIssue.focus(); }, 100);
  }

  function closeModal() {
    modalStatus.classList.remove('active');
    editingSessionId = null;
  }

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

  function getAllSessions() {
    try {
      const historyJson = localStorage.getItem(STORAGE_KEY);
      return historyJson ? JSON.parse(historyJson) : [];
    } catch (e) {
      console.warn('Erro ao ler sessões do localStorage:', e);
      return [];
    }
  }

  function saveAllSessions(sessions) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.warn('Erro ao gravar sessões no localStorage:', e);
    }
  }

  function persistSession(data, commandText) {
    const history = getAllSessions();
    const now = new Date();
    const sessionRecord = {
      id: 'ses_' + Date.now(),
      createdAt: now.toISOString(),      // UTC timestamp — usado para ordenação
      localDate: formatDateToISO(now),   // Data local YYYY-MM-DD — usado para agrupamento
      ...data,
      totalSeconds: lastSessionSeconds,
      generatedCommand: commandText
    };

    history.push(sessionRecord);
    saveAllSessions(history);
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const data = validateForm();
    if (!data) return;

    const commandText = buildStatusCommand(data);

    if (editingSessionId) {
      // --- EDIT MODE: update existing record in localStorage ---
      const allSessions = getAllSessions();
      const idx = allSessions.findIndex(s => s.id === editingSessionId);

      if (idx !== -1) {
        // Merge updated fields into the existing record
        Object.assign(allSessions[idx], data, { generatedCommand: commandText });
        saveAllSessions(allSessions);
      }

      closeModal();
      // Refresh history list so the updated card re-renders immediately
      renderHistory();
      showToast('Status atualizado com sucesso!');
    } else {
      // --- CREATE MODE: persist new session ---
      currentGeneratedCommand = commandText;
      persistSession(data, commandText);

      commandOutput.textContent = commandText;
      outputCard.classList.add('active');

      closeModal();
      outputCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      showToast('Status gerado com sucesso!');
    }
  }

  // --- Clipboard Utility ---

  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    } else {
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

  // --- History View Controller ---

  function updateHistoryDate(newDateString) {
    currentSelectedDate = newDateString;
    historyDatePicker.value = currentSelectedDate;
    renderHistory();
  }

  function renderHistory() {
    if (!historyDatePicker.value) {
      historyDatePicker.value = currentSelectedDate;
    }

    const allSessions = getAllSessions();

    // Filter sessions belonging to currentSelectedDate.
    // Use localDate (local YYYY-MM-DD) when available.
    // For old records that only have createdAt (UTC ISO), derive the local
    // date by parsing through Date (getFullYear/Month/Date = local coords).
    const dailySessions = allSessions.filter(session => {
      if (!session.createdAt && !session.localDate) return false;
      const sessionDate = session.localDate
        ? session.localDate
        : formatDateToISO(new Date(session.createdAt));
      return sessionDate === currentSelectedDate;
    });

    // Sort newest first
    dailySessions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Calculate daily summary
    const totalCount = dailySessions.length;
    const totalMinutes = dailySessions.reduce((sum, s) => sum + (Number(s.minutos_dedicados) || 0), 0);
    historyDailySummary.textContent = `${totalCount} ${totalCount === 1 ? 'registro' : 'registros'} • ${formatMinutesTotal(totalMinutes)}`;

    // Render list or empty state
    if (totalCount === 0) {
      historyList.innerHTML = '';
      historyEmpty.style.display = 'flex';
      return;
    }

    historyEmpty.style.display = 'none';
    historyList.innerHTML = '';

    dailySessions.forEach(session => {
      const card = createHistoryCardElement(session);
      historyList.appendChild(card);
    });
  }

  function createHistoryCardElement(session) {
    const card = document.createElement('article');
    card.className = 'history-card';
    card.setAttribute('data-id', session.id);

    const timeStr = formatTimeOfDay(session.createdAt);
    const commandText = session.generatedCommand || buildStatusCommand(session);

    card.innerHTML = `
      <div class="history-card-header">
        <div class="history-card-meta">
          <span class="badge-squad">${escapeHtml(session.squad || 'Geral')}</span>
          <span class="badge-category">${escapeHtml(session.categoria || 'dev')}</span>
          <span class="history-time">${escapeHtml(timeStr)}</span>
        </div>
        <span class="badge-minutes">${escapeHtml(String(session.minutos_dedicados || 0))} min</span>
      </div>
      <div class="history-card-body">
        <div class="history-command-box" tabindex="0">${escapeHtml(commandText)}</div>
      </div>
      <div class="history-card-actions">
        <div class="history-read-actions">
          <button type="button" class="btn btn-secondary btn-item-action btn-copy-history" data-id="${session.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true" style="width:14px;height:14px;">
              <rect x="9" y="9" width="13" height="13"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            <span>Copiar</span>
          </button>
          <button type="button" class="btn btn-secondary btn-item-action btn-edit-history" data-id="${session.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true" style="width:14px;height:14px;">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            <span>Editar</span>
          </button>
        </div>
      </div>
    `;

    // Elements inside this card
    const commandBox = card.querySelector('.history-command-box');
    const btnCopyHistory = card.querySelector('.btn-copy-history');
    const btnEditHistory = card.querySelector('.btn-edit-history');

    // 1. Copy Action
    btnCopyHistory.addEventListener('click', () => {
      const textToCopy = commandBox.textContent;
      copyToClipboard(textToCopy)
        .then(() => {
          const btnSpan = btnCopyHistory.querySelector('span');
          btnSpan.textContent = 'Copiado!';
          btnCopyHistory.style.background = 'var(--green-100)';
          showToast('Status copiado para a área de transferência!');

          setTimeout(() => {
            btnSpan.textContent = 'Copiar';
            btnCopyHistory.style.background = '';
          }, 2000);
        })
        .catch(err => {
          console.error('Erro ao copiar status:', err);
          showToast('Erro ao copiar texto.');
        });
    });

    // 2. Edit Action: open shared modal pre-filled with this session's data
    btnEditHistory.addEventListener('click', () => {
      // Re-fetch the latest version of this session from localStorage
      // (it may have been saved since the card was rendered)
      const freshSessions = getAllSessions();
      const freshSession = freshSessions.find(s => s.id === session.id) || session;
      openModalForEdit(freshSession);
    });

    return card;
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

  // Tabs
  tabTimer.addEventListener('click', () => switchTab('timer'));
  tabHistory.addEventListener('click', () => switchTab('history'));
  btnGoToTimer.addEventListener('click', () => switchTab('timer'));

  // Timer Controls
  btnStart.addEventListener('click', startTimer);
  btnPause.addEventListener('click', pauseTimer);
  btnResume.addEventListener('click', resumeTimer);
  btnStop.addEventListener('click', stopTimer);
  btnReset.addEventListener('click', resetTimer);

  // Modal Controls
  btnCloseModal.addEventListener('click', closeModal);
  btnCancelModal.addEventListener('click', closeModal);
  modalStatus.addEventListener('click', (e) => {
    if (e.target === modalStatus) {
      closeModal();
    }
  });

  // Keyboard accessibility (Escape to close modal)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalStatus.classList.contains('active')) {
      closeModal();
    }
  });

  // Form submission
  statusForm.addEventListener('submit', handleFormSubmit);

  // Remove input error states on change
  statusForm.querySelectorAll('.input, .select, .textarea').forEach(input => {
    input.addEventListener('input', () => input.classList.remove('error'));
    input.addEventListener('change', () => input.classList.remove('error'));
  });

  // Copy action on Timer View
  btnCopy.addEventListener('click', handleCopy);

  // History Date Controls
  btnPrevDay.addEventListener('click', () => {
    const parts = currentSelectedDate.split('-');
    const curDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    curDate.setDate(curDate.getDate() - 1);
    updateHistoryDate(formatDateToISO(curDate));
  });

  btnNextDay.addEventListener('click', () => {
    const parts = currentSelectedDate.split('-');
    const curDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    curDate.setDate(curDate.getDate() + 1);
    updateHistoryDate(formatDateToISO(curDate));
  });

  btnToday.addEventListener('click', () => {
    updateHistoryDate(formatDateToISO(new Date()));
  });

  historyDatePicker.addEventListener('change', () => {
    if (historyDatePicker.value) {
      updateHistoryDate(historyDatePicker.value);
    }
  });

  // --- Initial Setup ---
  historyDatePicker.value = currentSelectedDate;
  setTimerState('IDLE');
})();
