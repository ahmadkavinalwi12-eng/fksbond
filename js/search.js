// js/search.js - Fungsi Pencarian Global

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-bar input');
    if (!searchInput) return;

    // Buat container untuk hasil pencarian
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    searchResults.style.display = 'none';
    document.querySelector('.main-content').appendChild(searchResults);

    searchInput.addEventListener('input', function(e) {
        const keyword = e.target.value.toLowerCase().trim();
        
        if (keyword.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        // Kumpulkan hasil dari berbagai sumber
        const results = {
            keuangan: searchKeuangan(keyword),
            kebutuhan: searchKebutuhan(keyword),
            anggota: searchAnggota(keyword)
        };

        // Tampilkan hasil
        displaySearchResults(results, keyword);
    });

    // Fungsi pencarian di keuangan
    function searchKeuangan(keyword) {
        const keuangan = JSON.parse(localStorage.getItem('fks_keuangan') || '[]');
        return keuangan.filter(t => 
            t.description.toLowerCase().includes(keyword) ||
            t.date.includes(keyword) ||
            t.type.toLowerCase().includes(keyword) ||
            t.amount.toString().includes(keyword)
        ).slice(0, 5); // Batasi 5 hasil
    }

    // Fungsi pencarian di kebutuhan
    function searchKebutuhan(keyword) {
        const kebutuhan = JSON.parse(localStorage.getItem('fks_kebutuhan') || '{"checklist":{}}');
        const results = [];
        
        Object.keys(kebutuhan.checklist || {}).forEach(divisi => {
            Object.keys(kebutuhan.checklist[divisi]).forEach(item => {
                if (item.toLowerCase().includes(keyword)) {
                    results.push({
                        divisi: divisi,
                        item: item,
                        status: kebutuhan.checklist[divisi][item].checked ? '✓ Selesai' : '○ Belum'
                    });
                }
            });
        });
        
        return results.slice(0, 5);
    }

    // Fungsi pencarian di anggota
    function searchAnggota(keyword) {
        const struktur = JSON.parse(localStorage.getItem('fks_struktur_panitia') || '{"struktur":[]}');
        return (struktur.struktur || []).filter(p => 
            (p.nama && p.nama.toLowerCase().includes(keyword)) ||
            (p.jabatan && p.jabatan.toLowerCase().includes(keyword)) ||
            (p.divisi && p.divisi.toLowerCase().includes(keyword))
        ).slice(0, 5);
    }

    // Tampilkan hasil pencarian
    function displaySearchResults(results, keyword) {
        const total = results.keuangan.length + results.kebutuhan.length + results.anggota.length;
        
        if (total === 0) {
            searchResults.innerHTML = `<div class="search-result-item">Tidak ditemukan hasil untuk "${keyword}"</div>`;
            searchResults.style.display = 'block';
            return;
        }

        let html = `<div class="search-header">Hasil pencarian "${keyword}" (${total})</div>`;

        if (results.keuangan.length > 0) {
            html += '<div class="search-category"><i class="fas fa-wallet"></i> Keuangan</div>';
            results.keuangan.forEach(t => {
                html += `
                    <div class="search-result-item" onclick="window.location.href='Catatan_Keuangan.html'">
                        <span class="search-icon ${t.type}">
                            <i class="fas ${t.type === 'masuk' ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
                        </span>
                        <div class="search-detail">
                            <div class="search-title">${t.description}</div>
                            <div class="search-meta">${t.date} • ${t.type === 'masuk' ? 'Masuk' : 'Keluar'} • ${formatRupiah(t.amount)}</div>
                        </div>
                    </div>
                `;
            });
        }

        if (results.kebutuhan.length > 0) {
            html += '<div class="search-category"><i class="fas fa-clipboard-list"></i> Kebutuhan</div>';
            results.kebutuhan.forEach(k => {
                html += `
                    <div class="search-result-item" onclick="window.location.href='Ceklist_Kebutuhan.html'">
                        <span class="search-icon kebutuhan"><i class="fas fa-box"></i></span>
                        <div class="search-detail">
                            <div class="search-title">${k.item}</div>
                            <div class="search-meta">Divisi ${k.divisi} • ${k.status}</div>
                        </div>
                    </div>
                `;
            });
        }

        if (results.anggota.length > 0) {
            html += '<div class="search-category"><i class="fas fa-users"></i> Anggota</div>';
            results.anggota.forEach(a => {
                html += `
                    <div class="search-result-item" onclick="window.location.href='anggota.html'">
                        <span class="search-icon anggota"><i class="fas fa-user"></i></span>
                        <div class="search-detail">
                            <div class="search-title">${a.nama}</div>
                            <div class="search-meta">${a.jabatan} ${a.divisi ? '• ' + a.divisi : ''}</div>
                        </div>
                    </div>
                `;
            });
        }

        html += '<div class="search-footer">Klik item untuk membuka halaman</div>';
        searchResults.innerHTML = html;
        searchResults.style.display = 'block';
    }

    function formatRupiah(amount) {
        return 'Rp ' + amount.toLocaleString('id-ID');
    }

    // Sembunyikan hasil saat klik di luar
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });

    // Tampilkan lagi saat input difokuskan
    searchInput.addEventListener('focus', function() {
        if (this.value.length >= 2) {
            searchResults.style.display = 'block';
        }
    });
});