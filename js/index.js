// js/dashboard.js - DASHBOARD FKS BONDOWOSO (VERSI FINAL)

class Dashboard {
    constructor() {
        this.data = {
            keuangan: [],
            kebutuhan: {
                items: {},
                checklist: {}
            },
            kegiatan: [
                {
                    id: 1,
                    nama: 'Rapat Koordinator',
                    tanggal: '2026-03-05',
                    waktu: '19:30',
                    lokasi: 'Aula Ponpes'
                },
                {
                    id: 2,
                    nama: 'Pengajian Akbar',
                    tanggal: '2026-03-10',
                    waktu: '08:00',
                    lokasi: 'Masjid Jami\''
                },
                {
                    id: 3,
                    nama: 'Haul Gus Dur',
                    tanggal: '2026-03-15',
                    waktu: '19:00',
                    lokasi: 'Lapangan'
                }
            ],
            anggota: {
                total: 45,
                baru: 3
            },
            catatan: []
        };
        
        this.divisiList = [
            { id: 'sekretariat', nama: 'Kesekretariatan', icon: 'fa-folder', warna: '#3498db' },
            { id: 'acara', nama: 'Acara', icon: 'fa-calendar-check', warna: '#e67e22' },
            { id: 'perlengkapan', nama: 'Perlengkapan', icon: 'fa-tools', warna: '#2ecc71' },
            { id: 'keamanan', nama: 'Keamanan', icon: 'fa-shield-alt', warna: '#e74c3c' },
            { id: 'konsumsi', nama: 'Konsumsi', icon: 'fa-utensils', warna: '#f1c40f' },
            { id: 'humas', nama: 'Humas', icon: 'fa-handshake', warna: '#9b59b6' },
            { id: 'pubdekdok', nama: 'Pubdekdok', icon: 'fa-camera', warna: '#1abc9c' }
        ];
        
        this.init();
    }
    
    init() {
        console.log('Dashboard initialized');
        this.loadData();
        this.updateTanggal();
        this.updateStatCards();
        this.updateAktivitas();
        this.updateKegiatan();
        this.updateProgressKebutuhan();
        this.updateCatatan();
        this.updateWelcomeMessage();
        this.setupEventListeners();
    }
    
    loadData() {
        // ===== LOAD DATA KEUANGAN =====
        const keuangan = localStorage.getItem('fks_keuangan');
        if (keuangan) {
            try {
                this.data.keuangan = JSON.parse(keuangan);
                console.log('Data keuangan loaded:', this.data.keuangan.length, 'transaksi');
            } catch (e) {
                console.error('Gagal load keuangan:', e);
                this.data.keuangan = [];
            }
        } else {
            // Data default
            this.data.keuangan = [
                { id: 1, date: '2026-03-01', description: 'Donasi anggota', type: 'masuk', amount: 250000 },
                { id: 2, date: '2026-03-02', description: 'Iuran kas', type: 'masuk', amount: 250000 },
                { id: 3, date: '2026-03-03', description: 'Beli snack', type: 'keluar', amount: 100000 },
                { id: 4, date: '2026-03-04', description: 'Sewa alat', type: 'keluar', amount: 200000 },
                { id: 5, date: '2026-02-25', description: 'Kas bulan lalu', type: 'masuk', amount: 300000 }
            ];
        }
        
        // ===== LOAD DATA KEBUTUHAN =====
        const kebutuhan = localStorage.getItem('fks_kebutuhan');
        if (kebutuhan) {
            try {
                this.data.kebutuhan = JSON.parse(kebutuhan);
                console.log('Data kebutuhan loaded');
            } catch (e) {
                console.error('Gagal load kebutuhan:', e);
                this.data.kebutuhan = { items: {}, checklist: {} };
            }
        }
        
        // ===== LOAD DATA ANGGOTA =====
        const anggota = localStorage.getItem('fks_anggota');
        if (anggota) {
            try {
                this.data.anggota = JSON.parse(anggota);
            } catch (e) {
                console.error('Gagal load anggota:', e);
            }
        }
        
        // ===== LOAD CATATAN =====
        const catatan = localStorage.getItem('fks_catatan');
        if (catatan) {
            try {
                this.data.catatan = JSON.parse(catatan);
            } catch (e) {
                console.error('Gagal load catatan:', e);
                this.data.catatan = [];
            }
        } else {
            this.data.catatan = [
                { id: 1, teks: 'Bawa sound system untuk acara pengajian', tanggal: '2026-03-01' },
                { id: 2, teks: 'Konfirmasi kehadiran tamu undangan', tanggal: '2026-02-28' }
            ];
            localStorage.setItem('fks_catatan', JSON.stringify(this.data.catatan));
        }
        
        this.generateAktivitas();
    }
    
    generateAktivitas() {
        const aktivitas = [];
        
        if (this.data.keuangan && this.data.keuangan.length > 0) {
            const sorted = [...this.data.keuangan].sort((a, b) => 
                new Date(b.date) - new Date(a.date)
            ).slice(0, 4);
            
            sorted.forEach(t => {
                const waktu = this.getTimeAgo(t.date);
                aktivitas.push({
                    type: t.type,
                    text: t.type === 'masuk' 
                        ? `Pemasukan: ${t.description} <strong>${this.formatRupiah(t.amount)}</strong>`
                        : `Pengeluaran: ${t.description} <strong>${this.formatRupiah(t.amount)}</strong>`,
                    waktu: waktu,
                    icon: t.type === 'masuk' ? 'masuk' : 'keluar'
                });
            });
        }
        
        this.data.aktivitas = aktivitas;
    }
    
    getTimeAgo(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins} menit yang lalu`;
        if (diffHours < 24) return `${diffHours} jam yang lalu`;
        if (diffDays === 1) return 'Kemarin';
        if (diffDays < 7) return `${diffDays} hari yang lalu`;
        return date.toLocaleDateString('id-ID');
    }
    
    updateTanggal() {
        const dateEl = document.getElementById('currentDate');
        if (dateEl) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateEl.textContent = new Date().toLocaleDateString('id-ID', options);
        }
    }
    
    updateStatCards() {
        // ===== HITUNG DATA KEUANGAN =====
        let saldo = 0;
        let totalPemasukan = 0;
        let totalPengeluaran = 0;
        let pemasukanBulanIni = 0;
        let pengeluaranBulanIni = 0;
        
        const now = new Date();
        const bulanIni = now.getMonth();
        const tahunIni = now.getFullYear();
        
        console.log('Bulan ini:', bulanIni, 'Tahun:', tahunIni);
        
        this.data.keuangan.forEach(t => {
            const tgl = new Date(t.date);
            const bulanTransaksi = tgl.getMonth();
            const tahunTransaksi = tgl.getFullYear();
            
            // Hitung total pemasukan & pengeluaran
            if (t.type === 'masuk') {
                totalPemasukan += t.amount;
                saldo += t.amount;
            } else {
                totalPengeluaran += t.amount;
                saldo -= t.amount;
            }
            
            // Hitung bulan ini
            if (bulanTransaksi === bulanIni && tahunTransaksi === tahunIni) {
                if (t.type === 'masuk') {
                    pemasukanBulanIni += t.amount;
                } else {
                    pengeluaranBulanIni += t.amount;
                }
            }
        });
        
        console.log('Total Pemasukan:', totalPemasukan);
        console.log('Total Pengeluaran:', totalPengeluaran);
        console.log('Saldo:', saldo);
        console.log('Pengeluaran Bulan Ini:', pengeluaranBulanIni);
        
        // ===== UPDATE CARD 1: SALDO =====
        const saldoEl = document.querySelector('.stat-card:nth-child(1) .stat-value');
        if (saldoEl) saldoEl.textContent = this.formatRupiah(saldo);
        
        const saldoChangeEl = document.querySelector('.stat-card:nth-child(1) .stat-change');
        if (saldoChangeEl) {
            saldoChangeEl.innerHTML = `<i class="fas fa-chart-line"></i> Total pemasukan: ${this.formatRupiah(totalPemasukan)}`;
        }
        
        // ===== UPDATE CARD 2: PENGELUARAN BULAN INI =====
        const pengeluaranEl = document.querySelector('.stat-card:nth-child(2) .stat-value');
        if (pengeluaranEl) {
            pengeluaranEl.textContent = this.formatRupiah(pengeluaranBulanIni);
        }
        
        // Hitung perbandingan dengan bulan lalu
        const pengeluaranBulanLalu = this.hitungPengeluaranBulanLalu();
        const pengeluaranChangeEl = document.querySelector('.stat-card:nth-child(2) .stat-change');
        if (pengeluaranChangeEl) {
            if (pengeluaranBulanLalu === 0) {
                pengeluaranChangeEl.innerHTML = `<i class="fas fa-info-circle"></i> Total pengeluaran: ${this.formatRupiah(totalPengeluaran)}`;
            } else {
                const perubahan = ((pengeluaranBulanIni - pengeluaranBulanLalu) / pengeluaranBulanLalu) * 100;
                if (perubahan > 0) {
                    pengeluaranChangeEl.innerHTML = `<i class="fas fa-arrow-up"></i> +${perubahan.toFixed(1)}% dari bulan lalu`;
                    pengeluaranChangeEl.className = 'stat-change negative';
                } else {
                    pengeluaranChangeEl.innerHTML = `<i class="fas fa-arrow-down"></i> ${perubahan.toFixed(1)}% dari bulan lalu`;
                    pengeluaranChangeEl.className = 'stat-change positive';
                }
            }
        }
        
        // ===== UPDATE CARD 3: ANGGOTA =====
        const anggotaEl = document.querySelector('.stat-card:nth-child(3) .stat-value');
        if (anggotaEl) anggotaEl.textContent = this.data.anggota.total + ' Santri';
        
        const anggotaBaruEl = document.querySelector('.stat-card:nth-child(3) .stat-change');
        if (anggotaBaruEl) {
            anggotaBaruEl.innerHTML = `<i class="fas fa-user-plus"></i> ${this.data.anggota.baru} anggota baru bulan ini`;
        }
        
        // ===== UPDATE CARD 4: PROGRESS KEBUTUHAN =====
        const progress = this.hitungProgressKebutuhan();
        const progressEl = document.querySelector('.stat-card:nth-child(4) .stat-value');
        if (progressEl) progressEl.textContent = progress + '%';
        
        const progressChangeEl = document.querySelector('.stat-card:nth-child(4) .stat-change');
        if (progressChangeEl) {
            const totalItems = this.hitungTotalItemsKebutuhan();
            progressChangeEl.innerHTML = `<i class="fas fa-check-circle"></i> ${totalItems.selesai}/${totalItems.total} item selesai`;
        }
    }
    
    hitungPengeluaranBulanLalu() {
        const now = new Date();
        let bulanLalu = now.getMonth() - 1;
        let tahun = now.getFullYear();
        
        if (bulanLalu < 0) {
            bulanLalu = 11;
            tahun -= 1;
        }
        
        let total = 0;
        this.data.keuangan.forEach(t => {
            if (t.type === 'keluar') {
                const tgl = new Date(t.date);
                if (tgl.getMonth() === bulanLalu && tgl.getFullYear() === tahun) {
                    total += t.amount;
                }
            }
        });
        
        return total;
    }
    
    hitungProgressKebutuhan() {
        if (!this.data.kebutuhan.checklist) return 0;
        
        let totalItems = 0;
        let totalChecked = 0;
        
        Object.keys(this.data.kebutuhan.checklist).forEach(divisi => {
            Object.keys(this.data.kebutuhan.checklist[divisi]).forEach(item => {
                totalItems++;
                if (this.data.kebutuhan.checklist[divisi][item].checked) {
                    totalChecked++;
                }
            });
        });
        
        if (totalItems === 0) return 0;
        return Math.round((totalChecked / totalItems) * 100);
    }
    
    hitungTotalItemsKebutuhan() {
        if (!this.data.kebutuhan.checklist) return { total: 0, selesai: 0 };
        
        let total = 0;
        let selesai = 0;
        
        Object.keys(this.data.kebutuhan.checklist).forEach(divisi => {
            Object.keys(this.data.kebutuhan.checklist[divisi]).forEach(item => {
                total++;
                if (this.data.kebutuhan.checklist[divisi][item].checked) {
                    selesai++;
                }
            });
        });
        
        return { total, selesai };
    }
    
    updateAktivitas() {
        const container = document.querySelector('.activity-list');
        if (!container) return;
        
        if (!this.data.aktivitas || this.data.aktivitas.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #95a5a6; padding: 20px;">Belum ada aktivitas</p>';
            return;
        }
        
        let html = '';
        this.data.aktivitas.forEach(akt => {
            html += `
                <div class="activity-item">
                    <div class="activity-icon ${akt.icon}">
                        <i class="fas ${this.getIconForType(akt.type)}"></i>
                    </div>
                    <div class="activity-detail">
                        <p class="activity-text">${akt.text}</p>
                        <p class="activity-time">${akt.waktu}</p>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    getIconForType(type) {
        if (type === 'masuk') return 'fa-arrow-down';
        if (type === 'keluar') return 'fa-arrow-up';
        return 'fa-circle';
    }
    
    updateKegiatan() {
        const container = document.querySelector('.events-list');
        if (!container) return;
        
        let html = '';
        const now = new Date();
        
        this.data.kegiatan.forEach(keg => {
            const tglKeg = new Date(keg.tanggal);
            const diffTime = tglKeg - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            const hari = tglKeg.getDate().toString().padStart(2, '0');
            const bulan = tglKeg.toLocaleDateString('id-ID', { month: 'short' });
            
            let badgeClass = 'event-badge';
            let badgeText = `H-${diffDays}`;
            
            if (diffDays < 0) {
                badgeClass += ' past';
                badgeText = 'Terlewat';
            } else if (diffDays === 0) {
                badgeClass += ' today';
                badgeText = 'Hari Ini';
            } else if (diffDays <= 3) {
                badgeClass += ' soon';
            }
            
            html += `
                <div class="event-item">
                    <div class="event-date">
                        <span class="date">${hari}</span>
                        <span class="month">${bulan}</span>
                    </div>
                    <div class="event-info">
                        <h4>${keg.nama}</h4>
                        <p><i class="fas fa-clock"></i> ${keg.waktu}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${keg.lokasi}</p>
                    </div>
                    <span class="${badgeClass}">${badgeText}</span>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    updateProgressKebutuhan() {
        const container = document.querySelector('.progress-list');
        if (!container) return;
        
        let html = '';
        
        this.divisiList.forEach(divisi => {
            const progress = this.hitungProgressPerDivisi(divisi.id);
            
            html += `
                <div class="progress-item">
                    <div class="progress-label">
                        <span><i class="fas ${divisi.icon}"></i> ${divisi.nama}</span>
                        <span>${progress}%</span>
                    </div>
                    <div class="progress-bar-bg">
                        <div class="progress-fill" style="width: ${progress}%; background: ${divisi.warna};"></div>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    hitungProgressPerDivisi(divisiId) {
        if (!this.data.kebutuhan.checklist || !this.data.kebutuhan.checklist[divisiId]) {
            return 0;
        }
        
        const items = this.data.kebutuhan.checklist[divisiId];
        let total = 0;
        let checked = 0;
        
        Object.keys(items).forEach(key => {
            total++;
            if (items[key].checked) {
                checked++;
            }
        });
        
        if (total === 0) return 0;
        return Math.round((checked / total) * 100);
    }
    
    updateCatatan() {
        const container = document.querySelector('.memo-list');
        if (!container) return;
        
        if (this.data.catatan.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #95a5a6; padding: 20px;">Belum ada catatan</p>';
            return;
        }
        
        let html = '';
        this.data.catatan.slice(0, 3).forEach(c => {
            const tgl = new Date(c.tanggal).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
            
            html += `
                <div class="memo-item">
                    <p>${c.teks}</p>
                    <span class="memo-date">${tgl}</span>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    updateWelcomeMessage() {
        const welcomeEl = document.querySelector('.welcome-text h1 span');
        if (welcomeEl) {
            const hours = new Date().getHours();
            let greeting = 'Selamat Datang';
            
            if (hours < 12) greeting = 'Selamat Pagi';
            else if (hours < 15) greeting = 'Selamat Siang';
            else if (hours < 19) greeting = 'Selamat Sore';
            else greeting = 'Selamat Malam';
            
            welcomeEl.textContent = greeting + ', Admin FKS';
        }
        
        const kegiatanCount = document.querySelector('.welcome-text p');
        if (kegiatanCount) {
            const aktif = this.data.kegiatan.filter(k => new Date(k.tanggal) >= new Date()).length;
            kegiatanCount.innerHTML = `${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} • ${aktif} kegiatan aktif`;
        }
    }
    
    formatRupiah(amount) {
        return 'Rp ' + amount.toLocaleString('id-ID');
    }
    
    setupEventListeners() {
        // Quick action buttons
        const tambahTransaksiBtn = document.querySelector('.quick-btn:first-child');
        if (tambahTransaksiBtn) {
            tambahTransaksiBtn.addEventListener('click', () => {
                window.location.href = 'Catatan_Keuangan.html';
            });
        }
        
        const updateKebutuhanBtn = document.querySelector('.quick-btn:last-child');
        if (updateKebutuhanBtn) {
            updateKebutuhanBtn.addEventListener('click', () => {
                window.location.href = 'Ceklist_Kebutuhan.html';
            });
        }
        
        // Add memo button
        const addMemo = document.querySelector('.add-memo');
        if (addMemo) {
            addMemo.addEventListener('click', () => {
                const teks = prompt('Tulis catatan baru:');
                if (teks && teks.trim()) {
                    this.tambahCatatan(teks.trim());
                }
            });
        }
        
        // Quick links
        document.querySelectorAll('.link-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const text = link.querySelector('span').textContent;
                if (text === 'Backup Data') {
                    this.backupData();
                } else if (text === 'Laporan Bulanan') {
                    this.generateLaporan();
                } else if (text === 'Share ke WA') {
                    this.shareToWA();
                } else {
                    this.showToast('Fitur ' + text + ' akan segera hadir!', 'info');
                }
            });
        });
    }
    
    tambahCatatan(teks) {
        const catatanBaru = {
            id: Date.now(),
            teks: teks,
            tanggal: new Date().toISOString().split('T')[0]
        };
        
        this.data.catatan.unshift(catatanBaru);
        localStorage.setItem('fks_catatan', JSON.stringify(this.data.catatan));
        this.updateCatatan();
        this.showToast('Catatan berhasil ditambahkan!', 'success');
    }
    
    backupData() {
        const backup = {
            keuangan: this.data.keuangan,
            kebutuhan: this.data.kebutuhan,
            anggota: this.data.anggota,
            catatan: this.data.catatan,
            tanggal: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(backup, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `fks_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showToast('Data berhasil di-backup!', 'success');
    }
    
    generateLaporan() {
        const saldo = this.hitungSaldo();
        const progress = this.hitungProgressKebutuhan();
        
        const laporan = `LAPORAN FKS BONDOWOSO
=====================
Tanggal: ${new Date().toLocaleDateString('id-ID')}

KEUANGAN:
• Saldo: ${this.formatRupiah(saldo)}
• Total Transaksi: ${this.data.keuangan.length}

KEBUTUHAN:
• Progress: ${progress}%
• Divisi Aktif: 7

ANGGOTA:
• Total: ${this.data.anggota.total} orang
• Anggota Baru: ${this.data.anggota.baru} orang`;
        
        console.log(laporan);
        this.showToast('Laporan berhasil digenerate! Cek console.', 'success');
    }
    
    shareToWA() {
        const saldo = this.hitungSaldo();
        const progress = this.hitungProgressKebutuhan();
        
        const teks = `*FKS BONDOWOSO - Ringkasan Dashboard*
        
📊 *KEUANGAN*
• Saldo: ${this.formatRupiah(saldo)}
• Total Transaksi: ${this.data.keuangan.length}

📋 *KEBUTUHAN*
• Progress: ${progress}%
• 7 Divisi Aktif

👥 *ANGGOTA*
• Total: ${this.data.anggota.total} Santri
• Anggota Baru: ${this.data.anggota.baru}

_Dashboard FKS Bondowoso_`;
        
        const url = `https://wa.me/?text=${encodeURIComponent(teks)}`;
        window.open(url, '_blank');
    }
    
    hitungSaldo() {
        let saldo = 0;
        this.data.keuangan.forEach(t => {
            if (t.type === 'masuk') saldo += t.amount;
            else saldo -= t.amount;
        });
        return saldo;
    }
    
    showToast(message, type = 'success') {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();
        
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        
        let icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-exclamation-circle';
        if (type === 'warning') icon = 'fa-exclamation-triangle';
        if (type === 'info') icon = 'fa-info-circle';
        
        toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Inisialisasi
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.dashboard = new Dashboard();
    });
} else {
    window.dashboard = new Dashboard();
}