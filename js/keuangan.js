// js/kebutuhan.js

class KebutuhanApp {
    constructor() {
        this.data = {
            eventInfo: { name: '', date: '', location: '' },
            checklist: {},
            customItems: {}
        };
        
        this.init();
    }
    
    init() {
        // Load data dari localStorage
        this.loadFromStorage();
        
        // Set default date
        this.setDefaultDate();
        
        // Load checklist state
        this.loadChecklistState();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Update progress
        this.updateAllProgress();
        
        // Render summary
        this.renderSummary();
    }
    
    loadFromStorage() {
        const saved = localStorage.getItem('fks_kebutuhan');
        if (saved) {
            try {
                this.data = JSON.parse(saved);
            } catch (e) {
                console.error('Gagal load data:', e);
            }
        }
    }
    
    saveToStorage() {
        localStorage.setItem('fks_kebutuhan', JSON.stringify(this.data));
    }
    
    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        const eventDate = document.getElementById('eventDate');
        if (eventDate) {
            eventDate.value = this.data.eventInfo?.date || today;
        }
        
        const eventName = document.getElementById('eventName');
        if (eventName) {
            eventName.value = this.data.eventInfo?.name || '';
        }
        
        const eventLocation = document.getElementById('eventLocation');
        if (eventLocation) {
            eventLocation.value = this.data.eventInfo?.location || '';
        }
    }
    
    loadChecklistState() {
        if (!this.data.checklist) return;
        
        // Load checkbox states
        Object.keys(this.data.checklist).forEach(divisi => {
            Object.keys(this.data.checklist[divisi]).forEach(item => {
                const itemData = this.data.checklist[divisi][item];
                
                // Cari checkbox
                const checkbox = document.querySelector(`.divisi-checkbox[data-divisi="${divisi}"][data-item="${item}"]`);
                if (checkbox) {
                    checkbox.checked = itemData.checked || false;
                }
                
                // Cari note input
                const noteInput = document.querySelector(`.item-note[data-divisi="${divisi}"][data-item="${item}"]`);
                if (noteInput) {
                    noteInput.value = itemData.note || '';
                }
            });
        });
    }
    
    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const divisi = e.target.dataset.divisi;
                document.querySelectorAll('.divisi-panel').forEach(p => p.classList.remove('active'));
                document.getElementById(divisi).classList.add('active');
            });
        });
        
        // Checkbox changes
        document.querySelectorAll('.divisi-checkbox').forEach(cb => {
            cb.addEventListener('change', (e) => {
                this.saveChecklistState();
                this.updateProgress(e.target.dataset.divisi);
                this.renderSummary();
            });
        });
        
        // Input notes
        document.querySelectorAll('.item-note').forEach(input => {
            input.addEventListener('input', () => {
                this.saveChecklistState();
            });
        });
        
        // Event info changes
        document.getElementById('eventName').addEventListener('input', () => this.saveEventInfo());
        document.getElementById('eventDate').addEventListener('input', () => this.saveEventInfo());
        document.getElementById('eventLocation').addEventListener('input', () => this.saveEventInfo());
        
        // Save button
        document.getElementById('saveChecklist').addEventListener('click', () => {
            this.saveToStorage();
            this.showToast('Progress berhasil disimpan!', 'success');
        });
        
        // Reset button
        document.getElementById('resetChecklist').addEventListener('click', () => {
            this.showResetConfirmation();
        });
        
        // Export button
        document.getElementById('exportChecklist').addEventListener('click', () => {
            this.exportToPDF();
        });
        
        // Modal close
        document.querySelector('.close-modal').addEventListener('click', () => {
            document.getElementById('resetModal').style.display = 'none';
        });
        
        document.getElementById('cancelReset').addEventListener('click', () => {
            document.getElementById('resetModal').style.display = 'none';
        });
        
        document.getElementById('confirmReset').addEventListener('click', () => {
            this.resetAllChecklist();
            document.getElementById('resetModal').style.display = 'none';
        });
        
        // Click outside modal
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('resetModal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Tambahkan tombol edit dan delete ke setiap item (jika belum ada)
        this.addEditDeleteButtons();
    }

    addEditDeleteButtons() {
        // Fungsi ini akan menambahkan tombol edit dan delete ke setiap checklist item
        // Tapi karena HTML sudah fixed, kita akan menggunakan method terpisah untuk edit/delete
    }
    
    saveChecklistState() {
        if (!this.data.checklist) this.data.checklist = {};
        
        // Loop semua checkbox
        document.querySelectorAll('.divisi-checkbox').forEach(cb => {
            const divisi = cb.dataset.divisi;
            const item = cb.dataset.item;
            
            if (!this.data.checklist[divisi]) {
                this.data.checklist[divisi] = {};
            }
            
            if (!this.data.checklist[divisi][item]) {
                this.data.checklist[divisi][item] = {};
            }
            
            this.data.checklist[divisi][item].checked = cb.checked;
        });
        
        // Loop semua input notes
        document.querySelectorAll('.item-note').forEach(input => {
            const divisi = input.dataset.divisi;
            const item = input.dataset.item;
            
            if (this.data.checklist[divisi] && this.data.checklist[divisi][item]) {
                this.data.checklist[divisi][item].note = input.value;
            }
        });
        
        this.saveToStorage();
    }
    
    saveEventInfo() {
        this.data.eventInfo = {
            name: document.getElementById('eventName').value,
            date: document.getElementById('eventDate').value,
            location: document.getElementById('eventLocation').value
        };
        this.saveToStorage();
    }
    
    updateProgress(divisi) {
        const checkboxes = document.querySelectorAll(`.divisi-checkbox[data-divisi="${divisi}"]`);
        const total = checkboxes.length;
        const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
        const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;
        
        const progressBar = document.getElementById(`progress-${divisi}`);
        if (progressBar) {
            progressBar.style.width = percentage + '%';
            progressBar.textContent = percentage + '%';
            
            // Change color based on percentage
            if (percentage < 30) progressBar.style.backgroundColor = '#e74c3c';
            else if (percentage < 70) progressBar.style.backgroundColor = '#f39c12';
            else progressBar.style.backgroundColor = '#2ecc71';
        }
    }
    
    updateAllProgress() {
        const divisiList = ['sekretariat', 'acara', 'perlengkapan', 'keamanan', 'konsumsi', 'humas', 'pubdekdok'];
        divisiList.forEach(divisi => this.updateProgress(divisi));
    }
    
    renderSummary() {
        const summaryGrid = document.getElementById('summaryGrid');
        if (!summaryGrid) return;
        
        const divisiList = [
            { id: 'sekretariat', name: 'Kesekretariatan', icon: 'fa-folder', color: '#3498db' },
            { id: 'acara', name: 'Acara', icon: 'fa-calendar-check', color: '#e67e22' },
            { id: 'perlengkapan', name: 'Perlengkapan', icon: 'fa-tools', color: '#2ecc71' },
            { id: 'keamanan', name: 'Keamanan', icon: 'fa-shield-alt', color: '#e74c3c' },
            { id: 'konsumsi', name: 'Konsumsi', icon: 'fa-utensils', color: '#f1c40f' },
            { id: 'humas', name: 'Humas', icon: 'fa-handshake', color: '#9b59b6' },
            { id: 'pubdekdok', name: 'Pubdekdok', icon: 'fa-camera', color: '#1abc9c' }
        ];
        
        let html = '';
        
        divisiList.forEach(divisi => {
            const checkboxes = document.querySelectorAll(`.divisi-checkbox[data-divisi="${divisi.id}"]`);
            const total = checkboxes.length;
            const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
            const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;
            
            html += `
                <div class="summary-card" style="border-left-color: ${divisi.color}">
                    <h4><i class="fas ${divisi.icon}"></i> ${divisi.name}</h4>
                    <div class="progress-text">${percentage}%</div>
                    <div class="items-count">${checked}/${total} item</div>
                </div>
            `;
        });
        
        summaryGrid.innerHTML = html;
    }
    
    showResetConfirmation() {
        document.getElementById('resetModal').style.display = 'block';
    }
    
    resetAllChecklist() {
        // Uncheck all checkboxes
        document.querySelectorAll('.divisi-checkbox').forEach(cb => {
            cb.checked = false;
        });
        
        // Clear all notes
        document.querySelectorAll('.item-note').forEach(input => {
            input.value = '';
        });
        
        // Clear data
        this.data.checklist = {};
        this.saveToStorage();
        
        // Update UI
        this.updateAllProgress();
        this.renderSummary();
        
        this.showToast('Semua checklist telah direset!', 'warning');
    }
    
    exportToPDF() {
        // Cek apakah jsPDF tersedia
        if (typeof window.jspdf === 'undefined') {
            this.loadPDFLibrary();
            return;
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // Header
        doc.setFontSize(18);
        doc.setTextColor(44, 62, 80);
        doc.text('Ceklist Kebutuhan Per Divisi', 14, 20);
        doc.setFontSize(14);
        doc.setTextColor(52, 73, 94);
        doc.text('Forum Komunikasi Santri Bondowoso', 14, 30);
        
        // Event Info
        const eventName = document.getElementById('eventName').value || '-';
        const eventDate = document.getElementById('eventDate').value || '-';
        const eventLocation = document.getElementById('eventLocation').value || '-';
        
        doc.setFontSize(11);
        doc.setTextColor(41, 128, 185);
        doc.text(`Kegiatan: ${eventName}`, 14, 42);
        doc.text(`Tanggal: ${eventDate}`, 14, 50);
        doc.text(`Lokasi: ${eventLocation}`, 14, 58);
        
        // Summary
        doc.setFontSize(14);
        doc.setTextColor(44, 62, 80);
        doc.text('Ringkasan Progress', 14, 72);
        
        let yPos = 82;
        const divisiList = [
            { id: 'sekretariat', name: 'Kesekretariatan' },
            { id: 'acara', name: 'Acara' },
            { id: 'perlengkapan', name: 'Perlengkapan' },
            { id: 'keamanan', name: 'Keamanan' },
            { id: 'konsumsi', name: 'Konsumsi' },
            { id: 'humas', name: 'Humas' },
            { id: 'pubdekdok', name: 'Pubdekdok' }
        ];
        
        doc.setFontSize(10);
        divisiList.forEach((divisi, index) => {
            const checkboxes = document.querySelectorAll(`.divisi-checkbox[data-divisi="${divisi.id}"]`);
            const total = checkboxes.length;
            const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
            const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;
            
            const xPos = index % 2 === 0 ? 14 : 110;
            const rowY = yPos + (Math.floor(index / 2) * 8);
            
            doc.text(`${divisi.name}: ${percentage}% (${checked}/${total})`, xPos, rowY);
        });
        
        // Detail per Divisi
        doc.addPage();
        doc.setFontSize(16);
        doc.setTextColor(44, 62, 80);
        doc.text('Detail Kebutuhan per Divisi', 14, 20);
        
        let currentY = 35;
        
        divisiList.forEach((divisi, index) => {
            if (currentY > 250) {
                doc.addPage();
                currentY = 20;
            }
            
            doc.setFontSize(14);
            doc.setTextColor(52, 73, 94);
            doc.text(`${index + 1}. ${divisi.name}`, 14, currentY);
            currentY += 8;
            
            const items = document.querySelectorAll(`.divisi-checkbox[data-divisi="${divisi.id}"]`);
            
            doc.setFontSize(10);
            items.forEach(item => {
                if (currentY > 280) {
                    doc.addPage();
                    currentY = 20;
                }
                
                const row = item.closest('.checklist-item');
                const noteInput = row.querySelector('.item-note');
                const note = noteInput ? noteInput.value : '';
                const status = item.checked ? '✓' : '○';
                const label = row.querySelector('.checkbox-container').innerText.trim().replace('✓', '').replace('○', '');
                
                doc.text(`${status} ${label}`, 20, currentY);
                
                if (note) {
                    doc.setTextColor(127, 140, 141);
                    doc.text(`  Catatan: ${note}`, 25, currentY + 4);
                    currentY += 8;
                    doc.setTextColor(0, 0, 0);
                } else {
                    currentY += 6;
                }
            });
            
            currentY += 6;
        });
        
        // Footer
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(`Dokumen digenerate pada: ${new Date().toLocaleString('id-ID')}`, 14, doc.internal.pageSize.height - 10);
            doc.text(`Halaman ${i} dari ${totalPages}`, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 10);
        }
        
        // Save PDF
        const fileName = `ceklist_kebutuhan_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
        
        this.showToast('PDF berhasil diexport!', 'success');
    }
    
    loadPDFLibrary() {
        this.showToast('Memuat library PDF...', 'info');
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => {
            const script2 = document.createElement('script');
            script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js';
            script2.onload = () => {
                this.showToast('Library PDF siap, coba export lagi!', 'success');
            };
            document.head.appendChild(script2);
        };
        document.head.appendChild(script);
    }
    
    showToast(message, type = 'success') {
        // Hapus toast yang ada
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Buat toast baru
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        
        let icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-exclamation-circle';
        if (type === 'warning') icon = 'fa-exclamation-triangle';
        if (type === 'info') icon = 'fa-info-circle';
        
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Auto hide
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
    }
}

// Inisialisasi app setelah DOM siap
document.addEventListener('DOMContentLoaded', () => {
    window.app = new KebutuhanApp();
});