// js/keuangan.js - VERSI DIPERBAIKI dengan semua tombol aktif

class KeuanganApp {
    constructor() {
        this.transactions = [];
        this.currentFilter = 'semua';
        this.searchTerm = '';
        this.editId = null;
        
        this.init();
    }
    
    init() {
        console.log('KeuanganApp initialized');
        
        // Load data dari localStorage
        this.loadFromStorage();
        
        // Set tanggal hari ini sebagai default
        this.setDefaultDate();
        
        // Render data
        this.render();
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    loadFromStorage() {
        const saved = localStorage.getItem('fks_keuangan');
        if (saved) {
            try {
                this.transactions = JSON.parse(saved);
                console.log('Data loaded:', this.transactions.length, 'transactions');
            } catch (e) {
                console.error('Gagal load data:', e);
                this.transactions = [];
            }
        } else {
            // Data default jika belum ada
            this.transactions = [
                {
                    id: this.generateId(),
                    date: '2026-03-01',
                    description: 'Donasi anggota',
                    type: 'masuk',
                    amount: 250000
                },
                {
                    id: this.generateId(),
                    date: '2026-02-28',
                    description: 'Pembelian alat tulis',
                    type: 'keluar',
                    amount: 75000
                },
                {
                    id: this.generateId(),
                    date: '2026-02-25',
                    description: 'Kas bulanan',
                    type: 'masuk',
                    amount: 500000
                },
                {
                    id: this.generateId(),
                    date: '2026-02-20',
                    description: 'Sewa tempat rapat',
                    type: 'keluar',
                    amount: 200000
                },
                {
                    id: this.generateId(),
                    date: '2026-02-15',
                    description: 'Konsumsi rapat',
                    type: 'keluar',
                    amount: 150000
                }
            ];
            this.saveToStorage();
        }
    }
    
    saveToStorage() {
        localStorage.setItem('fks_keuangan', JSON.stringify(this.transactions));
        console.log('Data saved');
    }
    
    generateId() {
        return Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
    
    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('date');
        if (dateInput) {
            dateInput.value = today;
        }
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // 1. FORM SUBMIT
        const form = document.getElementById('transactionForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Form submitted');
                this.handleSubmit();
            });
        } else {
            console.error('Form not found!');
        }
        
        // 2. FILTER BUTTONS
        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Filter clicked:', e.target.dataset.filter);
                
                document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                this.currentFilter = e.target.dataset.filter;
                this.render();
            });
        });
        
        // 3. SEARCH INPUT
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.render();
            });
        }
        
        // 4. EXPORT BUTTON
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Export clicked');
                this.exportToPDF();
            });
        }
        
        // 5. IMPORT BUTTON
        const importBtn = document.getElementById('importBtn');
        if (importBtn) {
            importBtn.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('fileInput').click();
            });
        }
        
        // 6. FILE INPUT
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.importFromPDF(e.target.files[0]);
            });
        }
        
        // 7. CANCEL EDIT BUTTON
        const cancelBtn = document.getElementById('cancelEdit');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetForm();
            });
        }
        
        console.log('Event listeners setup complete');
    }
    
    handleSubmit() {
        const date = document.getElementById('date')?.value;
        const description = document.getElementById('description')?.value;
        const type = document.getElementById('type')?.value;
        const amount = parseInt(document.getElementById('amount')?.value);
        const editId = document.getElementById('editId')?.value;
        
        if (!date || !description || !amount || amount <= 0) {
            this.showToast('Mohon isi semua field dengan benar!', 'error');
            return;
        }
        
        const transaction = {
            id: editId || this.generateId(),
            date,
            description,
            type,
            amount
        };
        
        if (editId) {
            // Update existing
            const index = this.transactions.findIndex(t => t.id === editId);
            if (index !== -1) {
                this.transactions[index] = transaction;
                this.showToast('Transaksi berhasil diupdate!', 'success');
            }
            this.resetForm();
        } else {
            // Add new
            this.transactions.push(transaction);
            this.showToast('Transaksi berhasil ditambahkan!', 'success');
        }
        
        // Sort by date (terbaru di atas)
        this.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        this.saveToStorage();
        this.render();
        
        // Reset form
        document.getElementById('transactionForm')?.reset();
        this.setDefaultDate();
    }
    
    editTransaction(id) {
        console.log('Editing transaction:', id);
        
        const transaction = this.transactions.find(t => t.id === id);
        if (!transaction) {
            console.error('Transaction not found:', id);
            return;
        }
        
        this.editId = id;
        document.getElementById('editId').value = id;
        document.getElementById('date').value = transaction.date;
        document.getElementById('description').value = transaction.description;
        document.getElementById('type').value = transaction.type;
        document.getElementById('amount').value = transaction.amount;
        
        document.getElementById('formTitle').textContent = 'Edit Transaksi';
        document.getElementById('submitBtn').textContent = 'Update Transaksi';
        document.getElementById('cancelEdit').style.display = 'inline-block';
        
        // Scroll ke form
        document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth' });
    }
    
    deleteTransaction(id) {
        console.log('Deleting transaction:', id);
        
        if (!confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) return;
        
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.saveToStorage();
        this.render();
        
        // Jika yang dihapus sedang diedit, reset form
        if (this.editId === id) {
            this.resetForm();
        }
        
        this.showToast('Transaksi berhasil dihapus!', 'success');
    }
    
    resetForm() {
        this.editId = null;
        document.getElementById('editId').value = '';
        document.getElementById('transactionForm')?.reset();
        this.setDefaultDate();
        document.getElementById('formTitle').textContent = 'Tambah Transaksi Baru';
        document.getElementById('submitBtn').textContent = 'Simpan Transaksi';
        document.getElementById('cancelEdit').style.display = 'none';
    }
    
    getFilteredTransactions() {
        let filtered = [...this.transactions];
        
        // Filter by type
        if (this.currentFilter !== 'semua') {
            filtered = filtered.filter(t => t.type === this.currentFilter);
        }
        
        // Filter by search
        if (this.searchTerm) {
            filtered = filtered.filter(t => 
                t.description.toLowerCase().includes(this.searchTerm) ||
                t.date.includes(this.searchTerm)
            );
        }
        
        return filtered;
    }
    
    calculateTotals() {
        const totals = {
            masuk: 0,
            keluar: 0
        };
        
        this.transactions.forEach(t => {
            totals[t.type] += t.amount;
        });
        
        return {
            masuk: totals.masuk,
            keluar: totals.keluar,
            saldo: totals.masuk - totals.keluar
        };
    }
    
    formatRupiah(amount) {
        return 'Rp ' + amount.toLocaleString('id-ID');
    }
    
    render() {
        this.renderSummary();
        this.renderTable();
    }
    
    renderSummary() {
        const totals = this.calculateTotals();
        
        const totalSaldo = document.getElementById('totalSaldo');
        const totalMasuk = document.getElementById('totalMasuk');
        const totalKeluar = document.getElementById('totalKeluar');
        
        if (totalSaldo) totalSaldo.textContent = this.formatRupiah(totals.saldo);
        if (totalMasuk) totalMasuk.textContent = this.formatRupiah(totals.masuk);
        if (totalKeluar) totalKeluar.textContent = this.formatRupiah(totals.keluar);
    }
    
    renderTable() {
        const filtered = this.getFilteredTransactions();
        const tbody = document.getElementById('transactionTableBody');
        
        if (!tbody) {
            console.error('Table body not found!');
            return;
        }
        
        if (filtered.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 2rem; color: #7f8c8d;">
                        <i class="fas fa-inbox" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
                        Tidak ada transaksi
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        filtered.forEach(transaction => {
            const formattedAmount = this.formatRupiah(transaction.amount);
            const badgeClass = transaction.type === 'masuk' ? 'badge-masuk' : 'badge-keluar';
            const badgeText = transaction.type === 'masuk' ? 'Masuk' : 'Keluar';
            const amountClass = transaction.type === 'masuk' ? 'amount-in' : 'amount-out';
            
            // Escape description untuk mencegah masalah kutip
            const escapedDescription = transaction.description.replace(/'/g, "\\'");
            
            html += `
                <tr>
                    <td>${transaction.date}</td>
                    <td>${transaction.description}</td>
                    <td><span class="badge ${badgeClass}">${badgeText}</span></td>
                    <td class="${amountClass}">${formattedAmount}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-edit" onclick="app.editTransaction('${transaction.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-delete" onclick="app.deleteTransaction('${transaction.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
    }
    
    exportToPDF() {
        // Cek apakah jsPDF tersedia
        if (typeof window.jspdf === 'undefined') {
            this.showToast('Memuat library PDF...', 'info');
            this.loadPDFLibrary();
            return;
        }
        
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Header
            doc.setFontSize(18);
            doc.setTextColor(44, 62, 80);
            doc.text('Laporan Keuangan', 14, 20);
            doc.setFontSize(14);
            doc.setTextColor(52, 73, 94);
            doc.text('Forum Komunikasi Santri Bondowoso', 14, 30);
            
            // Tanggal cetak
            doc.setFontSize(10);
            doc.setTextColor(127, 140, 141);
            const today = new Date().toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            doc.text(`Dicetak: ${today}`, 14, 38);
            
            // Filter info
            let filterText = 'Semua Transaksi';
            if (this.currentFilter === 'masuk') filterText = 'Transaksi Masuk';
            if (this.currentFilter === 'keluar') filterText = 'Transaksi Keluar';
            if (this.searchTerm) filterText += ` - Pencarian: "${this.searchTerm}"`;
            doc.text(filterText, 14, 46);
            
            // Totals
            const totals = this.calculateTotals();
            doc.setFontSize(11);
            doc.setTextColor(41, 128, 185);
            doc.text(`Total Saldo: ${this.formatRupiah(totals.saldo)}`, 14, 56);
            doc.setTextColor(39, 174, 96);
            doc.text(`Total Masuk: ${this.formatRupiah(totals.masuk)}`, 14, 64);
            doc.setTextColor(192, 57, 43);
            doc.text(`Total Keluar: ${this.formatRupiah(totals.keluar)}`, 14, 72);
            
            // Table headers
            const headers = [['Tanggal', 'Keterangan', 'Jenis', 'Jumlah']];
            const filtered = this.getFilteredTransactions();
            
            // Prepare data
            const data = filtered.map(t => [
                t.date,
                t.description,
                t.type === 'masuk' ? 'Masuk' : 'Keluar',
                this.formatRupiah(t.amount)
            ]);
            
            // Generate table
            if (typeof doc.autoTable === 'function') {
                doc.autoTable({
                    head: headers,
                    body: data,
                    startY: 80,
                    theme: 'striped',
                    headStyles: {
                        fillColor: [52, 73, 94],
                        textColor: [255, 255, 255],
                        fontStyle: 'bold'
                    },
                    alternateRowStyles: {
                        fillColor: [245, 245, 245]
                    }
                });
            }
            
            // Save PDF
            const fileName = `keuangan_fks_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);
            
            this.showToast('PDF berhasil diexport!', 'success');
            
        } catch (error) {
            console.error('Error export PDF:', error);
            this.showToast('Gagal export PDF: ' + error.message, 'error');
        }
    }
    
    importFromPDF(file) {
        if (!file) return;
        
        this.showToast('Fitur import dari PDF akan segera hadir!', 'info');
        
        // Reset file input
        document.getElementById('fileInput').value = '';
    }
    
    loadPDFLibrary() {
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

// PASTIKAN INI DIJALANKAN SETELAH DOM SIAP
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM loading complete, creating app...');
        window.app = new KeuanganApp();
    });
} else {
    console.log('DOM already ready, creating app immediately...');
    window.app = new KeuanganApp();
}