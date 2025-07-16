"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const january = 'cauchy schwartz';
    console.log(january);
    // Navbar toggle icon logic
    const toggler = document.querySelector('.navbar-toggler');
    const icon = toggler === null || toggler === void 0 ? void 0 : toggler.querySelector('.navbar-toggler-icon');
    const closeIcon = toggler === null || toggler === void 0 ? void 0 : toggler.querySelector('.navbar-toggler-close');
    const navCollapse = document.getElementById('navbarNav');
    toggler === null || toggler === void 0 ? void 0 : toggler.addEventListener('click', () => {
        setTimeout(() => {
            if (navCollapse.classList.contains('show')) {
                icon.classList.add('d-none');
                closeIcon.classList.remove('d-none');
            }
            else {
                icon.classList.remove('d-none');
                closeIcon.classList.add('d-none');
            }
        }, 300);
    });
    navCollapse === null || navCollapse === void 0 ? void 0 : navCollapse.addEventListener('hidden.bs.collapse', () => {
        icon.classList.remove('d-none');
        closeIcon.classList.add('d-none');
    });
    navCollapse === null || navCollapse === void 0 ? void 0 : navCollapse.addEventListener('shown.bs.collapse', () => {
        icon.classList.add('d-none');
        closeIcon.classList.remove('d-none');
    });
    // Modal interaction logic
    const cardButtons = document.querySelectorAll('.card-button');
    const gradeModal = document.getElementById('grade-modal');
    const gradeModalContent = document.getElementById('grade-modal-content');
    const gradeButtons = document.querySelectorAll('.grade-button');
    const dataEntryModal = document.getElementById('data-entry-modal');
    const dataEntryModalContent = document.getElementById('data-entry-modal-content');
    const dataEntryForm = document.getElementById('data-entry-form');
    const formTitle = document.getElementById('form-title');
    const doneButton = document.getElementById('done-button');
    const mainContent = document.querySelector('main');
    let currentResultType = ''; // 'test', 'exam', or 'project'
    let selectedGrade = ''; // '1' through '6'
    function showModal(modalElement, contentElement) {
        modalElement.classList.add('show');
        void modalElement.offsetWidth; // Trigger reflow
        contentElement.classList.add('show');
    }
    function hideModal(modalElement, contentElement) {
        contentElement.classList.remove('show');
        modalElement.classList.remove('show');
    }
    cardButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            var _a;
            const target = event.currentTarget;
            currentResultType = (_a = target.dataset.resultType) !== null && _a !== void 0 ? _a : '';
            showModal(gradeModal, gradeModalContent);
            mainContent.classList.add('d-none');
        });
    });
    gradeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            var _a;
            const target = event.currentTarget;
            selectedGrade = (_a = target.dataset.grade) !== null && _a !== void 0 ? _a : '';
            hideModal(gradeModal, gradeModalContent);
            formTitle.textContent = `Enter ${currentResultType.charAt(0).toUpperCase() + currentResultType.slice(1)} Results for Grade ${selectedGrade}`;
            showModal(dataEntryModal, dataEntryModalContent);
        });
    });
    dataEntryForm.addEventListener('submit', (event) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
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
                studentName: (_b = (_a = formData.get('studentName')) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '',
                studentNumber: (_d = (_c = formData.get('studentNumber')) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : '',
                scoreEarned: parseFloat((_f = (_e = formData.get('scoreEarned')) === null || _e === void 0 ? void 0 : _e.toString()) !== null && _f !== void 0 ? _f : '0'),
                overallScore: parseFloat((_h = (_g = formData.get('overallScore')) === null || _g === void 0 ? void 0 : _g.toString()) !== null && _h !== void 0 ? _h : '0'),
            };
            console.log('Submitted Data:', data);
            dataEntryForm.reset();
            dataEntryForm.classList.remove('was-validated');
            (_j = document.getElementById('student-name')) === null || _j === void 0 ? void 0 : _j.focus();
        }
    });
    doneButton.addEventListener('click', () => {
        hideModal(dataEntryModal, dataEntryModalContent);
        mainContent.classList.remove('d-none');
        dataEntryForm.classList.remove('was-validated');
        dataEntryForm.reset();
    });
    gradeModal.addEventListener('click', (event) => {
        if (event.target === gradeModal) {
            hideModal(gradeModal, gradeModalContent);
            mainContent.classList.remove('d-none');
        }
    });
    dataEntryModal.addEventListener('click', (event) => {
        if (event.target === dataEntryModal) {
            hideModal(dataEntryModal, dataEntryModalContent);
            mainContent.classList.remove('d-none');
            dataEntryForm.classList.remove('was-validated');
            dataEntryForm.reset();
        }
    });
});
