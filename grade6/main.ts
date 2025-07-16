document.addEventListener('DOMContentLoaded', () => {
 
    const january:string = 'cauchy schwartz';
    console.log(january);
    // Navbar toggle icon logic
  const toggler = document.querySelector('.navbar-toggler') as HTMLElement;
  const icon = toggler?.querySelector('.navbar-toggler-icon') as HTMLElement;
  const closeIcon = toggler?.querySelector('.navbar-toggler-close') as HTMLElement;
  const navCollapse = document.getElementById('navbarNav') as HTMLElement;

  toggler?.addEventListener('click', () => {
    setTimeout(() => {
      if (navCollapse.classList.contains('show')) {
        icon.classList.add('d-none');
        closeIcon.classList.remove('d-none');
      } else {
        icon.classList.remove('d-none');
        closeIcon.classList.add('d-none');
      }
    }, 300);
  });

  navCollapse?.addEventListener('hidden.bs.collapse', () => {
    icon.classList.remove('d-none');
    closeIcon.classList.add('d-none');
  });

  navCollapse?.addEventListener('shown.bs.collapse', () => {
    icon.classList.add('d-none');
    closeIcon.classList.remove('d-none');
  });

  // Modal interaction logic
  const cardButtons = document.querySelectorAll('.card-button') as NodeListOf<HTMLButtonElement>;
  const gradeModal = document.getElementById('grade-modal') as HTMLElement;
  const gradeModalContent = document.getElementById('grade-modal-content') as HTMLElement;
  const gradeButtons = document.querySelectorAll('.grade-button') as NodeListOf<HTMLButtonElement>;
  const dataEntryModal = document.getElementById('data-entry-modal') as HTMLElement;
  const dataEntryModalContent = document.getElementById('data-entry-modal-content') as HTMLElement;
  const dataEntryForm = document.getElementById('data-entry-form') as HTMLFormElement;
  const formTitle = document.getElementById('form-title') as HTMLElement;
  const doneButton = document.getElementById('done-button') as HTMLButtonElement;
  const mainContent = document.querySelector('main') as HTMLElement;

  let currentResultType = ''; // 'test', 'exam', or 'project'
  let selectedGrade = '';     // '1' through '6'

  function showModal(modalElement: HTMLElement, contentElement: HTMLElement): void {
    modalElement.classList.add('show');
    void modalElement.offsetWidth; // Trigger reflow
    contentElement.classList.add('show');
  }

  function hideModal(modalElement: HTMLElement, contentElement: HTMLElement): void {
    contentElement.classList.remove('show');
    modalElement.classList.remove('show');
  }

  cardButtons.forEach(button => {
    button.addEventListener('click', (event: Event) => {
      const target = event.currentTarget as HTMLButtonElement;
      currentResultType = target.dataset.resultType ?? '';
      showModal(gradeModal, gradeModalContent);
      mainContent.classList.add('d-none');
    });
  });

  gradeButtons.forEach(button => {
    button.addEventListener('click', (event: Event) => {
      const target = event.currentTarget as HTMLButtonElement;
      selectedGrade = target.dataset.grade ?? '';
      hideModal(gradeModal, gradeModalContent);
      formTitle.textContent = `Enter ${currentResultType.charAt(0).toUpperCase() + currentResultType.slice(1)} Results for Grade ${selectedGrade}`;
      showModal(dataEntryModal, dataEntryModalContent);
    });
  });

  dataEntryForm.addEventListener('submit', (event: Event) => {
    event.preventDefault();

    if (!dataEntryForm.checkValidity()) {
      event.stopPropagation();
    }

    dataEntryForm.classList.add('was-validated');

    if (dataEntryForm.checkValidity()) {
      const formData = new FormData(dataEntryForm);

      const data = {
        resultType: currentResultType,
        grade: selectedGrade,
        studentName: formData.get('studentName')?.toString() ?? '',
        studentNumber: formData.get('studentNumber')?.toString() ?? '',
        scoreEarned: parseFloat(formData.get('scoreEarned')?.toString() ?? '0'),
        overallScore: parseFloat(formData.get('overallScore')?.toString() ?? '0'),
      };

      console.log('Submitted Data:', data);

      dataEntryForm.reset();
      dataEntryForm.classList.remove('was-validated');
      (document.getElementById('student-name') as HTMLInputElement)?.focus();
    }
  });

  doneButton.addEventListener('click', () => {
    hideModal(dataEntryModal, dataEntryModalContent);
    mainContent.classList.remove('d-none');
    dataEntryForm.classList.remove('was-validated');
    dataEntryForm.reset();
  });

  gradeModal.addEventListener('click', (event: MouseEvent) => {
    if (event.target === gradeModal) {
      hideModal(gradeModal, gradeModalContent);
      mainContent.classList.remove('d-none');
    }
  });

  dataEntryModal.addEventListener('click', (event: MouseEvent) => {
    if (event.target === dataEntryModal) {
      hideModal(dataEntryModal, dataEntryModalContent);
      mainContent.classList.remove('d-none');
      dataEntryForm.classList.remove('was-validated');
      dataEntryForm.reset();
    }
  });
});
