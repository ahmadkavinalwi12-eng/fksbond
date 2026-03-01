document.addEventListener("DOMContentLoaded", () => {
    updateDashboard();
});

function updateDashboard() {
    updateAnggota();
}

// =============================
// UPDATE TOTAL ANGGOTA
// =============================
function updateAnggota() {
    try {
        const dataStruktur =
            JSON.parse(localStorage.getItem("fks_struktur_panitia")) || {};

        const struktur = dataStruktur.struktur || [];

        const totalAnggota = struktur.length;

        // Total anggota
        const anggotaEl = document.querySelector(
            ".stat-card:nth-child(2) .stat-value"
        );

        if (anggotaEl) {
            anggotaEl.textContent = totalAnggota + " Santri";
        }

        // Anggota divisi (level anggota)
        const anggotaDivisi = struktur.filter(
            (item) => item.level === "anggota"
        ).length;

        const changeEl = document.querySelector(
            ".stat-card:nth-child(2) .stat-change"
        );

        if (changeEl) {
            changeEl.innerHTML =
                `<i class="fas fa-users"></i> ${anggotaDivisi} anggota divisi`;
        }
    } catch (error) {
        console.error("Gagal membaca data anggota:", error);
    }
}