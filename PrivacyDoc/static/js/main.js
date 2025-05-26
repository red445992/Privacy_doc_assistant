// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Auto-hide alerts after 5 seconds
    setTimeout(function() {
        var alerts = document.querySelectorAll('.alert');
        alerts.forEach(function(alert) {
            var bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        });
    }, 5000);

    // File input preview
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const fileName = e.target.files[0]?.name;
            if (fileName) {
                const fileLabel = document.querySelector('.custom-file-label');
                if (fileLabel) {
                    fileLabel.textContent = fileName;
                }
            }
        });
    }

    // Policy text counter
    const policyText = document.querySelector('.policy-text');
    if (policyText) {
        const counter = document.createElement('div');
        counter.className = 'text-muted small mt-2';
        policyText.parentNode.appendChild(counter);

        policyText.addEventListener('input', function() {
            const words = this.value.trim().split(/\s+/).length;
            counter.textContent = `${words} words`;
        });
    }
}); 