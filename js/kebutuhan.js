// js/kebutuhan.js - VERSI CUSTOM (ANDA YANG NENTUIN)

class KebutuhanApp {
    constructor() {
        this.data = {
            eventInfo: { name: '', date: '', location: '' },
            items: {},      // Menyimpan daftar item per divisi
            checklist: {}    // Menyimpan status centang dan jumlah
        };
        
        // Data default (bisa dihapus nantinya)
        this.defaultItems = {
            sekretariat: [],
            acara: [],
            perlengkapan: [],
            keamanan: [],
            konsumsi: [],
            humas: [],
            pubdekdok: []
        };
        
        this.init();
    }
    
    init() {
        console.log('App initialized');
        
        this.loadFromStorage();
        this.setDefaultDate();
        this.renderSemuaDivisi();  // Render ulang semua divisi
        this.setupEventListeners();
        this.updateAllProgress();
        this.renderSummary();
    }
    
    loadFromStorage() {
        try {
            const saved = localStorage.getItem('fks_kebutuhan_custom');
            if (saved) {
                this.data = JSON.parse(saved);
                console.log('Data loaded from storage');
            } else {
                // Jika belum ada data, mulai dengan array kosong
                this.data.items = {
                    sekretariat: [],
                    acara: [],
                    perlengkapan: [],
                    keamanan: [],
                    konsumsi: [],
                    humas: [],
                    pubdekdok: []
                };
                this.data.checklist = {};
            }
        } catch (e) {
            console.error('Gagal load data:', e);
        }
    }
    
    saveToStorage() {
        try {
            localStorage.setItem('fks_kebutuhan_custom', JSON.stringify(this.data));
            console.log('Data saved to storage');
        } catch (e) {
            console.error('Gagal save data:', e);
        }
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
    
    renderSemuaDivisi() {
        const divisiList = [
            { id: 'sekretariat', name: 'Kesekretariatan', icon: 'fa-folder' },
            { id: 'acara', name: 'Acara', icon: 'fa-calendar-check' },
            { id: 'perlengkapan', name: 'Perlengkapan', icon: 'fa-tools' },
            { id: 'keamanan', name: 'Keamanan', icon: 'fa-shield-alt' },
            { id: 'konsumsi', name: 'Konsumsi', icon: 'fa-utensils' },
            { id: 'humas', name: 'Humas', icon: 'fa-handshake' },
            { id: 'pubdekdok', name: 'Pubdekdok', icon: 'fa-camera' }
        ];
        
        divisiList.forEach(divisi => {
            this.renderDivisi(divisi.id);
        });
        
        // Update progress setelah render
        this.updateAllProgress();
    }
    
    renderDivisi(divisiId) {
        const panel = document.getElementById(divisiId);
        if (!panel) return;
        
        const items = this.data.items[divisiId] || [];
        const checklistGrid = panel.querySelector('.checklist-grid');
        if (!checklistGrid) return;
        
        let html = '';
        
        // Tampilkan semua item yang ada
        items.forEach((item, index) => {
            const itemId = item.id || `item-${index}`;
            const itemName = item.name || item;
            const checked = this.data.checklist?.[divisiId]?.[itemId]?.checked || false;
            const jumlah = this.data.checklist?.[divisiId]?.[itemId]?.jumlah || '';
            const catatan = this.data.checklist?.[divisiId]?.[itemId]?.catatan || '';
            
            html += `
                <div class="checklist-item" data-item-id="${itemId}">
                    <div class="item-header">
                        <label class="checkbox-container">
                            <input type="checkbox" class="divisi-checkbox" 
                                   data-divisi="${divisiId}" 
                                   data-item-id="${itemId}"
                                   data-item-name="${itemName}"
                                   ${checked ? 'checked' : ''}>
                            <span class="checkmark"></span>
                            <span class="item-text">${itemName}</span>
                        </label>
                        <div class="item-actions">
                            <button class="btn-edit-item" onclick="app.editItem('${divisiId}', '${itemId}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-delete-item" onclick="app.deleteItem('${divisiId}', '${itemId}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="item-details">
                        <div class="jumlah-input">
                            <label>Jumlah:</label>
                            <input type="text" class="item-jumlah" 
                                   placeholder="Contoh: 10 buah, 5 rim, dll"
                                   data-divisi="${divisiId}"
                                   data-item-id="${itemId}"
                                   value="${jumlah}">
                        </div>
                        <div class="catatan-input">
                            <label>Catatan:</label>
                            <input type="text" class="item-catatan" 
                                   placeholder="Catatan tambahan..."
                                   data-divisi="${divisiId}"
                                   data-item-id="${itemId}"
                                   value="${catatan}">
                        </div>
                    </div>
                </div>
            `;
        });
        
        // Form untuk tambah item baru
        html += `
            <div class="add-item-form">
                <div class="add-item-row">
                    <input type="text" id="newItemName-${divisiId}" placeholder="Nama kebutuhan (contoh: Notulen Rapat)">
                    <button class="btn-add-item" onclick="app.addItem('${divisiId}')">
                        <i class="fas fa-plus"></i> Tambah
                    </button>
                </div>
            </div>
        `;
        
        checklistGrid.innerHTML = html;
        
        // Attach event listeners untuk input jumlah dan catatan
        this.attachItemEventListeners(divisiId);
    }
    
    attachItemEventListeners(divisiId) {
        // Event untuk checkbox
        document.querySelectorAll(`.divisi-checkbox[data-divisi="${divisiId}"]`).forEach(cb => {
            cb.addEventListener('change', (e) => {
                e.preventDefault();
                this.saveItemState(divisiId, e.target.dataset.itemId);
                this.updateProgress(divisiId);
                this.renderSummary();
            });
        });
        
        // Event untuk input jumlah
        document.querySelectorAll(`.item-jumlah[data-divisi="${divisiId}"]`).forEach(input => {
            input.addEventListener('input', (e) => {
                e.preventDefault();
                this.saveItemState(divisiId, e.target.dataset.itemId);
            });
        });
        
        // Event untuk input catatan
        document.querySelectorAll(`.item-catatan[data-divisi="${divisiId}"]`).forEach(input => {
            input.addEventListener('input', (e) => {
                e.preventDefault();
                this.saveItemState(divisiId, e.target.dataset.itemId);
            });
        });
    }
    
    addItem(divisiId) {
        const input = document.getElementById(`newItemName-${divisiId}`);
        const itemName = input.value.trim();
        
        if (!itemName) {
            this.showToast('Mohon isi nama kebutuhan', 'warning');
            return;
        }
        
        // Buat ID unik untuk item
        const itemId = 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
        
        // Tambah ke data items
        if (!this.data.items[divisiId]) {
            this.data.items[divisiId] = [];
        }
        
        this.data.items[divisiId].push({
            id: itemId,
            name: itemName
        });
        
        // Simpan ke storage
        this.saveToStorage();
        
        // Render ulang divisi
        this.renderDivisi(divisiId);
        
        // Update progress
        this.updateProgress(divisiId);
        this.renderSummary();
        
        // Kosongkan input
        input.value = '';
        
        this.showToast('Kebutuhan berhasil ditambahkan!', 'success');
    }
    
    editItem(divisiId, itemId) {
        const items = this.data.items[divisiId] || [];
        const item = items.find(i => i.id === itemId);
        
        if (!item) return;
        
        const newName = prompt('Edit nama kebutuhan:', item.name);
        
        if (newName && newName.trim() !== '') {
            item.name = newName.trim();
            
            // Update juga di checklist
            if (this.data.checklist[divisiId] && this.data.checklist[divisiId][itemId]) {
                // Nama item tersimpan di struktur, tidak perlu update
            }
            
            this.saveToStorage();
            this.renderDivisi(divisiId);
            this.showToast('Kebutuhan berhasil diedit!', 'success');
        }
    }
    
    deleteItem(divisiId, itemId) {
        if (!confirm('Apakah Anda yakin ingin menghapus kebutuhan ini?')) return;
        
        // Hapus dari items
        if (this.data.items[divisiId]) {
            this.data.items[divisiId] = this.data.items[divisiId].filter(i => i.id !== itemId);
        }
        
        // Hapus dari checklist
        if (this.data.checklist[divisiId] && this.data.checklist[divisiId][itemId]) {
            delete this.data.checklist[divisiId][itemId];
        }
        
        this.saveToStorage();
        this.renderDivisi(divisiId);
        this.updateProgress(divisiId);
        this.renderSummary();
        
        this.showToast('Kebutuhan berhasil dihapus!', 'warning');
    }
    
    saveItemState(divisiId, itemId) {
        const checkbox = document.querySelector(`.divisi-checkbox[data-divisi="${divisiId}"][data-item-id="${itemId}"]`);
        const jumlahInput = document.querySelector(`.item-jumlah[data-divisi="${divisiId}"][data-item-id="${itemId}"]`);
        const catatanInput = document.querySelector(`.item-catatan[data-divisi="${divisiId}"][data-item-id="${itemId}"]`);
        
        if (!checkbox) return;
        
        const itemName = checkbox.dataset.itemName;
        
        if (!this.data.checklist[divisiId]) {
            this.data.checklist[divisiId] = {};
        }
        
        this.data.checklist[divisiId][itemId] = {
            name: itemName,
            checked: checkbox.checked,
            jumlah: jumlahInput ? jumlahInput.value : '',
            catatan: catatanInput ? catatanInput.value : ''
        };
        
        this.saveToStorage();
    }
    
    setupEventListeners() {
        // Tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const divisi = e.target.dataset.divisi;
                document.querySelectorAll('.divisi-panel').forEach(p => p.classList.remove('active'));
                document.getElementById(divisi).classList.add('active');
            });
        });
        
        // Event info changes
        document.getElementById('eventName')?.addEventListener('input', () => this.saveEventInfo());
        document.getElementById('eventDate')?.addEventListener('input', () => this.saveEventInfo());
        document.getElementById('eventLocation')?.addEventListener('input', () => this.saveEventInfo());
        
        // Save button
        document.getElementById('saveChecklist')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.saveToStorage();
            this.showToast('Progress berhasil disimpan!', 'success');
        });
        
        // Reset button
        document.getElementById('resetChecklist')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.showResetConfirmation();
        });
        
        // Export button
        document.getElementById('exportChecklist')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.exportToPDF();
        });
        
        // Modal buttons
        document.querySelector('.close-modal')?.addEventListener('click', () => {
            document.getElementById('resetModal').style.display = 'none';
        });
        
        document.getElementById('cancelReset')?.addEventListener('click', () => {
            document.getElementById('resetModal').style.display = 'none';
        });
        
        document.getElementById('confirmReset')?.addEventListener('click', () => {
            this.resetAllChecklist();
            document.getElementById('resetModal').style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('resetModal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    saveEventInfo() {
        this.data.eventInfo = {
            name: document.getElementById('eventName')?.value || '',
            date: document.getElementById('eventDate')?.value || '',
            location: document.getElementById('eventLocation')?.value || ''
        };
        this.saveToStorage();
    }
    
    updateProgress(divisiId) {
        const items = this.data.items[divisiId] || [];
        const total = items.length;
        
        let checked = 0;
        items.forEach(item => {
            if (this.data.checklist?.[divisiId]?.[item.id]?.checked) {
                checked++;
            }
        });
        
        const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;
        
        const progressBar = document.getElementById(`progress-${divisiId}`);
        if (progressBar) {
            progressBar.style.width = percentage + '%';
            progressBar.textContent = percentage + '%';
            
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
            const items = this.data.items[divisi.id] || [];
            const total = items.length;
            
            let checked = 0;
            items.forEach(item => {
                if (this.data.checklist?.[divisi.id]?.[item.id]?.checked) {
                    checked++;
                }
            });
            
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
    
    resetAllChecklist() {
        // Reset semua checklist (centang dan jumlah dihapus, tapi item tetap ada)
        this.data.checklist = {};
        this.saveToStorage();
        
        // Render ulang semua divisi
        this.renderSemuaDivisi();
        this.renderSummary();
        
        this.showToast('Semua checklist telah direset!', 'warning');
    }
    
    showResetConfirmation() {
        document.getElementById('resetModal').style.display = 'block';
    }
        
exportToPDF() {
    if (typeof window.jspdf === 'undefined') {
        this.showToast('Memuat library PDF...', 'info');
        this.loadPDFLibrary(() => this.exportToPDF());
        return;
    }

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');

        // PAKSA FONT STABIL
        doc.setFont('Times', 'Normal');

        // NORMALISASI TEKS
        const cleanText = (text) => {
            if (!text) return '';
            return String(text)
                .replace(/[\u2018\u2019]/g, "'")
                .replace(/[\u201C\u201D]/g, '"')
                .replace(/[^\x00-\x7F]/g, '');
        };

        // HEADER
        doc.setFontSize(18);
        doc.text('Ceklist Kebutuhan Per Divisi', 14, 20);

        doc.setFontSize(14);
        doc.text('Forum Komunikasi Santri Bondowoso', 14, 30);

        const eventName = cleanText(this.data.eventInfo?.name || '-');
        const eventDate = cleanText(this.data.eventInfo?.date || '-');
        const eventLocation = cleanText(this.data.eventInfo?.location || '-');

        doc.setFontSize(11);
        doc.text(`Kegiatan: ${eventName}`, 14, 42);
        doc.text(`Tanggal: ${eventDate}`, 14, 50);
        doc.text(`Lokasi: ${eventLocation}`, 14, 58);

        doc.addPage();
        doc.setFontSize(16);
        doc.text('Detail Kebutuhan per Divisi', 14, 20);

        let currentY = 35;

        const divisiList = [
            { id: 'sekretariat', name: 'Kesekretariatan' },
            { id: 'acara', name: 'Acara' },
            { id: 'perlengkapan', name: 'Perlengkapan' },
            { id: 'keamanan', name: 'Keamanan' },
            { id: 'konsumsi', name: 'Konsumsi' },
            { id: 'humas', name: 'Humas' },
            { id: 'pubdekdok', name: 'Pubdekdok' }
        ];

        divisiList.forEach((divisi, index) => {
            doc.setFontSize(14);
            doc.text(`${index + 1}. ${cleanText(divisi.name)}`, 14, currentY);
            currentY += 8;

            const items = this.data.items?.[divisi.id] || [];

            items.forEach(item => {
                const checklist = this.data.checklist?.[divisi.id]?.[item.id] || {};
                const status = checklist.checked ? '[OK]' : '[ ]';
                const jumlah = checklist.jumlah ? ` (${cleanText(checklist.jumlah)})` : '';

                doc.setFontSize(10);
                doc.text(
                    cleanText(`${status} ${item.name}${jumlah}`),
                    20,
                    currentY
                );

                currentY += 6;

                if (currentY > 280) {
                    doc.addPage();
                    currentY = 20;
                }
            });

            currentY += 5;
        });

        doc.save(`ceklist_${Date.now()}.pdf`);
        this.showToast('PDF berhasil dibuat!', 'success');

    } catch (error) {
        console.error(error);
        this.showToast('Export gagal', 'error');
    }
}
    
loadPDFLibrary(callback) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

    script.onload = () => {
        if (callback) callback();
    };

    document.head.appendChild(script);
}
    
    showToast(message, type = 'success') {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
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

// Inisialisasi
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new KebutuhanApp();
    });
} else {
    window.app = new KebutuhanApp();
}