// js/struktur-panitia.js - VERSI SESUAI GAMBAR

class StrukturPanitia {
    constructor() {
        this.data = {
            eventInfo: {
                name: 'Peringatan Haul',
                date: '2026-03-15',
                location: 'Masjid Jami\''
            },
            struktur: [
                {
                    id: 'ketua-umum',
                    jabatan: 'Ketua Umum',
                    nama: 'Muhammad Ferdiyanto',
                    level: 'utama'
                },
                {
                    id: 'ketua-panitia',
                    jabatan: 'Ketua Panitia',
                    nama: 'M. Kanzullabiq Kamal',
                    level: 'utama'
                },
                {
                    id: 'sc-sekretaris',
                    jabatan: 'SC Sekretaris',
                    nama: 'Ust. Zidan',
                    level: 'sc'
                },
                {
                    id: 'sekretaris',
                    jabatan: 'Sekretaris',
                    nama: 'Adjie Seto Hidayatullah',
                    level: 'pelaksana'
                },
                {
                    id: 'sc-bendahara',
                    jabatan: 'SC Bendahara',
                    nama: 'Khairun Nafis',
                    level: 'sc'
                },
                {
                    id: 'bendahara',
                    jabatan: 'Bendahara',
                    nama: 'Roshyfill Lubbin Muhammad',
                    level: 'pelaksana'
                },
                {
                    id: 'sc-acara',
                    jabatan: 'SC Acara',
                    nama: 'Ahmad Kavin Alwi',
                    level: 'sc'
                },
                {
                    id: 'koord-acara',
                    jabatan: 'Koord. Acara',
                    nama: 'Bima Putra Pradana',
                    level: 'koordinator'
                },
                {
                    id: 'anggota-acara-1',
                    jabatan: 'Anggota',
                    nama: 'Maula Kirana Ahmad',
                    level: 'anggota',
                    divisi: 'Acara'
                },
                {
                    id: 'anggota-acara-2',
                    jabatan: 'Anggota',
                    nama: 'Mahbub Bakhtiar',
                    level: 'anggota',
                    divisi: 'Acara'
                },
                {
                    id: 'anggota-acara-3',
                    jabatan: 'Anggota',
                    nama: 'Mahreza Dzakwan Azmi Bahar',
                    level: 'anggota',
                    divisi: 'Acara'
                },
                {
                    id: 'sc-humas',
                    jabatan: 'SC Humasy',
                    nama: 'Ahmad Haqiq Uliil Albab',
                    level: 'sc'
                },
                {
                    id: 'koord-humas',
                    jabatan: 'Koord. Humasy',
                    nama: 'M. Laziq Fakhri',
                    level: 'koordinator'
                },
                {
                    id: 'anggota-humas-1',
                    jabatan: 'Anggota',
                    nama: 'Yanuar Rizqi Wahyudi',
                    level: 'anggota',
                    divisi: 'Humas'
                },
                {
                    id: 'anggota-humas-2',
                    jabatan: 'Anggota',
                    nama: 'Muhammad Khoiri',
                    level: 'anggota',
                    divisi: 'Humas'
                },
                {
                    id: 'anggota-humas-3',
                    jabatan: 'Anggota',
                    nama: 'Robaitul Hasan',
                    level: 'anggota',
                    divisi: 'Humas'
                },
                {
                    id: 'sc-konsumsi',
                    jabatan: 'SC Komsumsi',
                    nama: 'Rhagil Tri Kurniawan',
                    level: 'sc'
                },
                {
                    id: 'koord-konsumsi',
                    jabatan: 'Koord. Komsumsi',
                    nama: 'M. Ghaura Amar Al-anam',
                    level: 'koordinator'
                },
                {
                    id: 'anggota-konsumsi-1',
                    jabatan: 'Anggota',
                    nama: 'Muhammad Ali Ridho',
                    level: 'anggota',
                    divisi: 'Konsumsi'
                },
                {
                    id: 'sc-perlengkapan',
                    jabatan: 'SC Perlengkapan',
                    nama: 'Muhdar',
                    level: 'sc'
                },
                {
                    id: 'koord-perlengkapan',
                    jabatan: 'Koord. Perlengkapan',
                    nama: 'M. Shodiqil Amin',
                    level: 'koordinator'
                },
                {
                    id: 'anggota-perlengkapan-1',
                    jabatan: 'Anggota',
                    nama: 'Razendra Faiz Bruh',
                    level: 'anggota',
                    divisi: 'Perlengkapan'
                },
                {
                    id: 'anggota-perlengkapan-2',
                    jabatan: 'Anggota',
                    nama: 'Nabil Mukhtar',
                    level: 'anggota',
                    divisi: 'Perlengkapan'
                },
                {
                    id: 'sc-keamanan',
                    jabatan: 'SC Keamanan',
                    nama: 'Muhdar',
                    level: 'sc'
                }
            ]
        };
        
        this.init();
    }
    
    init() {
        console.log('StrukturPanitia initialized');
        this.loadFromStorage();
        this.setDefaultDate();
        this.renderStruktur();
        this.setupEventListeners();
    }
    
    loadFromStorage() {
        const saved = localStorage.getItem('fks_struktur_panitia');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.struktur && parsed.struktur.length > 0) {
                    this.data = parsed;
                    console.log('Data struktur loaded');
                }
            } catch (e) {
                console.error('Gagal load data:', e);
            }
        }
    }
    
    saveToStorage() {
        localStorage.setItem('fks_struktur_panitia', JSON.stringify(this.data));
        console.log('Data struktur saved');
    }
    
    setDefaultDate() {
        const eventDate = document.getElementById('eventDate');
        if (eventDate) {
            eventDate.value = this.data.eventInfo?.date || '2026-03-15';
        }
        
        const eventName = document.getElementById('eventName');
        if (eventName) {
            eventName.value = this.data.eventInfo?.name || 'Peringatan Haul';
        }
        
        const eventLocation = document.getElementById('eventLocation');
        if (eventLocation) {
            eventLocation.value = this.data.eventInfo?.location || 'Masjid Jami\'';
        }
    }
    
    saveEventInfo() {
        this.data.eventInfo = {
            name: document.getElementById('eventName').value,
            date: document.getElementById('eventDate').value,
            location: document.getElementById('eventLocation').value
        };
        this.saveToStorage();
    }
    
    renderStruktur() {
        const container = document.getElementById('strukturContainer');
        if (!container) return;
        
        // Kelompokkan berdasarkan level
        const ketua = this.data.struktur.filter(p => p.level === 'utama');
        const sc = this.data.struktur.filter(p => p.level === 'sc');
        const koordinator = this.data.struktur.filter(p => p.level === 'koordinator');
        const anggota = this.data.struktur.filter(p => p.level === 'anggota');
        
        // Kelompokkan anggota per divisi
        const anggotaByDivisi = {};
        anggota.forEach(a => {
            if (!anggotaByDivisi[a.divisi]) {
                anggotaByDivisi[a.divisi] = [];
            }
            anggotaByDivisi[a.divisi].push(a);
        });
        
        let html = `
            <div class="struktur-panitia">
                <!-- KETUA SECTION -->
                <div class="struktur-section ketua-section">
                    <h3 class="section-title"><i class="fas fa-crown"></i> PIMPINAN</h3>
                    <div class="ketua-grid">
        `;
        
        ketua.forEach(p => {
            html += `
                <div class="ketua-card" data-id="${p.id}">
                    <div class="ketua-header" style="background: linear-gradient(135deg, #f39c12, #e67e22);">
                        <i class="fas fa-star"></i>
                        <span class="jabatan-label">${p.jabatan}</span>
                    </div>
                    <div class="ketua-body">
                        <h4>${p.nama}</h4>
                        <div class="ketua-actions">
                            <button class="btn-mini edit" onclick="app.editPerson('${p.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-mini delete" onclick="app.deletePerson('${p.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `
                    </div>
                </div>
                
                <!-- STEERING COMMITTEE SECTION -->
                <div class="struktur-section sc-section">
                    <h3 class="section-title"><i class="fas fa-users-cog"></i> STEERING COMMITTEE (SC)</h3>
                    <div class="sc-grid">
        `;
        
        sc.forEach(p => {
            html += `
                <div class="sc-card" data-id="${p.id}">
                    <div class="sc-header" style="background: linear-gradient(135deg, #3498db, #2980b9);">
                        <i class="fas fa-user-tie"></i>
                        <span class="jabatan-label">${p.jabatan}</span>
                    </div>
                    <div class="sc-body">
                        <h4>${p.nama}</h4>
                        <div class="sc-actions">
                            <button class="btn-mini edit" onclick="app.editPerson('${p.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-mini delete" onclick="app.deletePerson('${p.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `
                    </div>
                </div>
                
                <!-- KOORDINATOR SECTION -->
                <div class="struktur-section koordinator-section">
                    <h3 class="section-title"><i class="fas fa-user-tie"></i> KOORDINATOR</h3>
                    <div class="koordinator-grid">
        `;
        
        koordinator.forEach(p => {
            html += `
                <div class="koordinator-card" data-id="${p.id}">
                    <div class="koordinator-header" style="background: linear-gradient(135deg, #2ecc71, #27ae60);">
                        <i class="fas fa-user-check"></i>
                        <span class="jabatan-label">${p.jabatan}</span>
                    </div>
                    <div class="koordinator-body">
                        <h4>${p.nama}</h4>
                        <div class="koordinator-actions">
                            <button class="btn-mini edit" onclick="app.editPerson('${p.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-mini delete" onclick="app.deletePerson('${p.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `
                    </div>
                </div>
                
                <!-- ANGGOTA SECTION -->
                <div class="struktur-section anggota-section">
                    <h3 class="section-title"><i class="fas fa-users"></i> ANGGOTA</h3>
        `;
        
        // Tampilkan anggota per divisi
        for (const [divisi, anggotaList] of Object.entries(anggotaByDivisi)) {
            let warna = '#3498db';
            if (divisi === 'Acara') warna = '#e67e22';
            if (divisi === 'Humas') warna = '#9b59b6';
            if (divisi === 'Konsumsi') warna = '#f1c40f';
            if (divisi === 'Perlengkapan') warna = '#2ecc71';
            
            html += `
                <div class="divisi-anggota" style="border-left-color: ${warna};">
                    <h4 class="divisi-title" style="color: ${warna};">
                        <i class="fas fa-folder-open"></i> Divisi ${divisi}
                    </h4>
                    <div class="anggota-list">
            `;
            
            anggotaList.forEach(a => {
                html += `
                    <div class="anggota-item" data-id="${a.id}">
                        <div class="anggota-info">
                            <i class="fas fa-user-circle"></i>
                            <span class="anggota-nama">${a.nama}</span>
                            <span class="anggota-jabatan">${a.jabatan}</span>
                        </div>
                        <div class="anggota-actions">
                            <button class="btn-mini edit" onclick="app.editPerson('${a.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-mini delete" onclick="app.deletePerson('${a.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }
    
    setupEventListeners() {
        // Event info changes
        document.getElementById('eventName').addEventListener('input', () => this.saveEventInfo());
        document.getElementById('eventDate').addEventListener('input', () => this.saveEventInfo());
        document.getElementById('eventLocation').addEventListener('input', () => this.saveEventInfo());
        
        // Tambah Person button
        document.getElementById('tambahPersonBtn').addEventListener('click', () => {
            this.openTambahPersonModal();
        });
        
        // Modal buttons
        document.getElementById('batalModal').addEventListener('click', () => {
            document.getElementById('personModal').style.display = 'none';
        });
        
        document.getElementById('batalHapus').addEventListener('click', () => {
            document.getElementById('hapusModal').style.display = 'none';
        });
        
        document.getElementById('simpanPerson').addEventListener('click', () => {
            this.simpanPerson();
        });
        
        document.getElementById('konfirmasiHapus').addEventListener('click', () => {
            this.konfirmasiHapus();
        });
        
        // Close modal buttons
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });
        
        // Click outside modal
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
        
        // Action buttons
        document.getElementById('simpanStruktur').addEventListener('click', () => {
            this.saveToStorage();
            this.showToast('Struktur berhasil disimpan!', 'success');
        });
        
        document.getElementById('exportStruktur').addEventListener('click', () => {
            this.exportToPDF();
        });
        
        document.getElementById('resetStruktur').addEventListener('click', () => {
            if (confirm('Reset ke data default? Semua perubahan akan hilang.')) {
                location.reload();
            }
        });
    }
    
    openTambahPersonModal() {
        document.getElementById('modalTitle').innerHTML = '<i class="fas fa-user-plus"></i> Tambah Personil';
        document.getElementById('editPersonId').value = '';
        document.getElementById('personForm').reset();
        document.getElementById('personModal').style.display = 'block';
    }
    
    editPerson(id) {
        const person = this.data.struktur.find(p => p.id === id);
        if (!person) return;
        
        document.getElementById('modalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Personil';
        document.getElementById('editPersonId').value = id;
        document.getElementById('personNama').value = person.nama;
        document.getElementById('personJabatan').value = person.jabatan;
        document.getElementById('personLevel').value = person.level;
        document.getElementById('personDivisi').value = person.divisi || '';
        
        document.getElementById('personModal').style.display = 'block';
    }
    
    simpanPerson() {
        const id = document.getElementById('editPersonId').value;
        const nama = document.getElementById('personNama').value.trim();
        const jabatan = document.getElementById('personJabatan').value.trim();
        const level = document.getElementById('personLevel').value;
        const divisi = document.getElementById('personDivisi').value;
        
        if (!nama || !jabatan) {
            this.showToast('Nama dan jabatan harus diisi', 'error');
            return;
        }
        
        if (id) {
            // Edit
            const person = this.data.struktur.find(p => p.id === id);
            if (person) {
                person.nama = nama;
                person.jabatan = jabatan;
                person.level = level;
                person.divisi = level === 'anggota' ? divisi : undefined;
                this.showToast('Data berhasil diupdate', 'success');
            }
        } else {
            // Tambah baru
            const newId = 'person-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
            const newPerson = {
                id: newId,
                nama: nama,
                jabatan: jabatan,
                level: level
            };
            if (level === 'anggota' && divisi) {
                newPerson.divisi = divisi;
            }
            this.data.struktur.push(newPerson);
            this.showToast('Personil berhasil ditambahkan', 'success');
        }
        
        this.saveToStorage();
        this.renderStruktur();
        document.getElementById('personModal').style.display = 'none';
    }
    
    deletePerson(id) {
        this.currentDeleteId = id;
        document.getElementById('hapusMessage').textContent = 'Apakah Anda yakin ingin menghapus personil ini?';
        document.getElementById('hapusModal').style.display = 'block';
    }
    
    konfirmasiHapus() {
        this.data.struktur = this.data.struktur.filter(p => p.id !== this.currentDeleteId);
        this.saveToStorage();
        this.renderStruktur();
        this.showToast('Personil berhasil dihapus', 'warning');
        document.getElementById('hapusModal').style.display = 'none';
    }
    
    exportToPDF() {
        if (typeof window.jspdf === 'undefined') {
            this.loadPDFLibrary();
            return;
        }
        
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            doc.setFontSize(18);
            doc.setTextColor(44, 62, 80);
            doc.text('STRUKTUR PANITIA', 14, 20);
            doc.setFontSize(14);
            doc.setTextColor(52, 73, 94);
            doc.text(this.data.eventInfo.name, 14, 30);
            
            const eventDate = this.data.eventInfo.date;
            const eventLocation = this.data.eventInfo.location;
            
            doc.setFontSize(11);
            doc.setTextColor(41, 128, 185);
            doc.text(`Tanggal: ${eventDate}`, 14, 42);
            doc.text(`Lokasi: ${eventLocation}`, 14, 50);
            
            let yPos = 65;
            
            // Kelompokkan berdasarkan level
            const ketua = this.data.struktur.filter(p => p.level === 'utama');
            const sc = this.data.struktur.filter(p => p.level === 'sc');
            const koordinator = this.data.struktur.filter(p => p.level === 'koordinator');
            const anggota = this.data.struktur.filter(p => p.level === 'anggota');
            
            // Ketua
            if (ketua.length > 0) {
                doc.setFontSize(12);
                doc.setTextColor(243, 156, 18);
                doc.text('PIMPINAN', 14, yPos);
                yPos += 6;
                
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                ketua.forEach(p => {
                    doc.text(`• ${p.jabatan}: ${p.nama}`, 18, yPos);
                    yPos += 5;
                });
                yPos += 5;
            }
            
            // SC
            if (sc.length > 0) {
                doc.setFontSize(12);
                doc.setTextColor(52, 152, 219);
                doc.text('STEERING COMMITTEE (SC)', 14, yPos);
                yPos += 6;
                
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                sc.forEach(p => {
                    doc.text(`• ${p.jabatan}: ${p.nama}`, 18, yPos);
                    yPos += 5;
                });
                yPos += 5;
            }
            
            // Koordinator
            if (koordinator.length > 0) {
                doc.setFontSize(12);
                doc.setTextColor(46, 204, 113);
                doc.text('KOORDINATOR', 14, yPos);
                yPos += 6;
                
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                koordinator.forEach(p => {
                    doc.text(`• ${p.jabatan}: ${p.nama}`, 18, yPos);
                    yPos += 5;
                });
                yPos += 5;
            }
            
            // Anggota per divisi
            const anggotaByDivisi = {};
            anggota.forEach(a => {
                if (!anggotaByDivisi[a.divisi]) {
                    anggotaByDivisi[a.divisi] = [];
                }
                anggotaByDivisi[a.divisi].push(a);
            });
            
            for (const [divisi, anggotaList] of Object.entries(anggotaByDivisi)) {
                if (yPos > 250) {
                    doc.addPage();
                    yPos = 20;
                }
                
                doc.setFontSize(12);
                doc.setTextColor(155, 89, 182);
                doc.text(`DIVISI ${divisi.toUpperCase()}`, 14, yPos);
                yPos += 6;
                
                doc.setFontSize(10);
                doc.setTextColor(0, 0, 0);
                anggotaList.forEach(a => {
                    doc.text(`• ${a.nama} (${a.jabatan})`, 18, yPos);
                    yPos += 5;
                });
                yPos += 5;
            }
            
            doc.save(`struktur_panitia_${new Date().toISOString().split('T')[0]}.pdf`);
            this.showToast('PDF berhasil diexport!', 'success');
            
        } catch (error) {
            console.error('Error export PDF:', error);
            this.showToast('Gagal export PDF: ' + error.message, 'error');
        }
    }
    
    loadPDFLibrary() {
        this.showToast('Memuat library PDF...', 'info');
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => {
            this.showToast('Library PDF siap, coba export lagi!', 'success');
        };
        document.head.appendChild(script);
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
        window.app = new StrukturPanitia();
    });
} else {
    window.app = new StrukturPanitia();
}