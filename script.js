// --- MOCK DATA ---
const mockProjects = [
    { id: 1, name: 'Villa Senja', status: 'Ongoing', client: 'Bpk. Budi Santoso', location: 'Ubud, Bali', progress: 65, type: 'Residensial', deadline: '2026-08-15', description: 'Desain villa tropis modern dengan 4 kamar tidur dan kolam renang infinity.' },
    { id: 2, name: 'Kantor Tech Nusantara', status: 'Completed', client: 'PT. Tech Indo', location: 'SCBD, Jakarta', progress: 100, type: 'Komersial', deadline: '2026-01-10', description: 'Renovasi interior kantor startup 3 lantai dengan konsep open space.' },
];

const mockStats = [
    { label: 'Total Proyek', value: '12', icon: 'folder-kanban', color: 'bg-blue' },
    { label: 'Berjalan', value: '5', icon: 'clock', color: 'bg-amber' },
    { label: 'Selesai', value: '6', icon: 'check-circle-2', color: 'bg-emerald' },
];

// --- STATE MANAGEMENT ---
let state = {
    currentView: 'dashboard', // 'dashboard', 'directory', 'project_detail'
    selectedProject: null,
    activeTab: 'overview', // 'overview', 'spatial', dll
    zones: [
        {
            id: 1, title: 'Zona Publik', circulationPercent: 20,
            rooms: [
                { id: 1, room: 'Ruang Keluarga', capacity: '6-8', area: '45', needs: 'Pencahayaan alami', relations: 'Dapur' }
            ]
        }
    ]
};

// --- CORE FUNCTIONS ---
function render() {
    const container = document.getElementById('view-container');
    container.innerHTML = ''; // Bersihkan view sebelumnya

    if (state.currentView === 'dashboard') {
        container.innerHTML = createDashboardHTML();
    } else if (state.currentView === 'directory') {
        container.innerHTML = createDirectoryHTML();
    } else if (state.currentView === 'project_detail') {
        container.innerHTML = createProjectDetailHTML();
    }

    // Eksekusi fungsi tambahan setelah render (seperti attach event listener)
    attachDynamicEventListeners();
    lucide.createIcons(); // Perbarui ikon
}

function navigateTo(view, projectId = null) {
    state.currentView = view;
    if (projectId) {
        state.selectedProject = mockProjects.find(p => p.id === projectId);
        state.activeTab = 'overview';
    }
    
    // Update tombol sidebar aktif
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.target === view || (view === 'project_detail' && btn.dataset.target === 'directory'));
    });
    
    render();
}

function setTab(tabId) {
    state.activeTab = tabId;
    render();
}

// --- HTML GENERATORS ---
function createDashboardHTML() {
    const statsHTML = mockStats.map(stat => `
        <div class="card stat-box">
            <div class="stat-icon ${stat.color}"><i data-lucide="${stat.icon}"></i></div>
            <div>
                <p style="font-size: 0.875rem; color: var(--slate-500);">${stat.label}</p>
                <p style="font-size: 1.5rem; font-weight: bold;">${stat.value}</p>
            </div>
        </div>
    `).join('');

    return `
        <div style="margin-bottom: 24px;">
            <h2>Selamat datang kembali!</h2>
            <p style="color: var(--slate-500)">Berikut adalah ringkasan aktivitas studio Anda hari ini.</p>
        </div>
        <div class="grid-4">${statsHTML}</div>
    `;
}

function createDirectoryHTML() {
    const projectsHTML = mockProjects.map(project => `
        <div class="card project-card" onclick="navigateTo('project_detail', ${project.id})">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span class="tag ${project.status === 'Ongoing' ? 'ongoing' : 'completed'}">${project.status}</span>
                <i data-lucide="more-vertical" style="color: var(--slate-400)"></i>
            </div>
            <h3>${project.name}</h3>
            <p style="color: var(--slate-500); font-size: 0.875rem; margin: 12px 0;">${project.description}</p>
            
            <div style="margin-top: auto; padding-top: 16px; border-top: 1px solid var(--slate-100);">
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-bottom: 8px;">
                    <span>Progres</span>
                    <strong>${project.progress}%</strong>
                </div>
                <div style="width: 100%; background: var(--slate-200); border-radius: 8px; height: 6px;">
                    <div style="width: ${project.progress}%; height: 100%; background: var(--blue-500); border-radius: 8px;"></div>
                </div>
            </div>
        </div>
    `).join('');

    return `
        <h2>Direktori Proyek</h2>
        <div class="project-grid">${projectsHTML}</div>
    `;
}

function createProjectDetailHTML() {
    const p = state.selectedProject;
    
    // Tab Navigation
    const tabs = [
        { id: 'overview', label: 'Ikhtisar', icon: 'file-text' },
        { id: 'spatial', label: 'Program Ruang', icon: 'grid' }
    ];
    
    const tabsHTML = tabs.map(tab => `
        <button class="tab-btn ${state.activeTab === tab.id ? 'active' : ''}" onclick="setTab('${tab.id}')">
            <i data-lucide="${tab.icon}" style="width: 18px;"></i> ${tab.label}
        </button>
    `).join('');

    // Tab Content
    let tabContent = '';
    if (state.activeTab === 'overview') {
        tabContent = `
            <div class="card">
                <h3>Deskripsi Proyek</h3>
                <p style="margin-top: 8px; color: var(--slate-600); line-height: 1.6;">${p.description}</p>
                <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--slate-200);">
                <h4>Info Detail</h4>
                <ul style="list-style: none; margin-top: 12px; color: var(--slate-600);">
                    <li><strong>Klien:</strong> ${p.client}</li>
                    <li style="margin-top: 8px;"><strong>Lokasi:</strong> ${p.location}</li>
                    <li style="margin-top: 8px;"><strong>Deadline:</strong> ${p.deadline}</li>
                </ul>
            </div>
        `;
    } else if (state.activeTab === 'spatial') {
        tabContent = renderSpatialTab();
    }

    return `
        <button onclick="navigateTo('directory')" style="background:none; border:none; cursor:pointer; color: var(--slate-500); display: flex; align-items: center; gap: 4px; margin-bottom: 16px;">
            <i data-lucide="chevron-left"></i> Kembali ke Direktori
        </button>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <div>
                <h2 style="font-size: 2rem;">${p.name}</h2>
                <span class="tag ${p.status === 'Ongoing' ? 'ongoing' : 'completed'}">${p.status}</span>
            </div>
        </div>
        <div class="tabs">${tabsHTML}</div>
        <div>${tabContent}</div>
    `;
}

// Logika Khusus untuk Program Ruang (Spatial)
function renderSpatialTab() {
    let zonesHTML = state.zones.map(zone => {
        let subTotal = zone.rooms.reduce((sum, room) => sum + (parseFloat(room.area) || 0), 0);
        let sirkulasiArea = subTotal * (parseFloat(zone.circulationPercent) || 0) / 100;
        let totalArea = subTotal + sirkulasiArea;

        let roomsHTML = zone.rooms.map(room => `
            <tr>
                <td><input type="text" value="${room.room}" onchange="updateRoom(${zone.id}, ${room.id}, 'room', this.value)"></td>
                <td><input type="text" value="${room.capacity}" onchange="updateRoom(${zone.id}, ${room.id}, 'capacity', this.value)"></td>
                <td><input type="number" value="${room.area}" onchange="updateRoom(${zone.id}, ${room.id}, 'area', this.value)"></td>
                <td><input type="text" value="${room.needs}" onchange="updateRoom(${zone.id}, ${room.id}, 'needs', this.value)"></td>
                <td><input type="text" value="${room.relations}" onchange="updateRoom(${zone.id}, ${room.id}, 'relations', this.value)"></td>
                <td><button onclick="removeRoom(${zone.id}, ${room.id})" style="color: var(--red-500); background: none; border: none; cursor: pointer;"><i data-lucide="trash-2" style="width:16px;"></i></button></td>
            </tr>
        `).join('');

        return `
            <div class="card" style="margin-bottom: 24px; padding: 0; overflow: hidden;">
                <div style="background: var(--slate-50); padding: 16px; border-bottom: 1px solid var(--slate-200); display: flex; justify-content: space-between; align-items: center;">
                    <input type="text" value="${zone.title}" onchange="updateZone(${zone.id}, 'title', this.value)" style="font-weight: bold; font-size: 1rem; border: none; background: transparent; outline: none;">
                    <button class="btn-primary" onclick="addRoom(${zone.id})" style="padding: 6px 12px; font-size: 0.875rem;"><i data-lucide="plus" style="width: 14px;"></i> Baris Baru</button>
                </div>
                <div style="overflow-x: auto;">
                    <table class="spatial-table">
                        <thead>
                            <tr>
                                <th>Nama Ruang</th><th>Kapasitas</th><th>Luas (m²)</th><th>Kebutuhan</th><th>Hubungan</th><th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>${roomsHTML}</tbody>
                        <tfoot>
                            <tr style="background: var(--slate-50);">
                                <td colspan="2" style="text-align: right; color: var(--slate-500);">Sirkulasi (%):</td>
                                <td><input type="number" value="${zone.circulationPercent}" onchange="updateZone(${zone.id}, 'circulationPercent', this.value)" style="width: 60px; background: white; border: 1px solid var(--slate-200);"></td>
                                <td colspan="3" style="color: var(--slate-500);">+ ${sirkulasiArea.toFixed(2)} m²</td>
                            </tr>
                            <tr style="background: #f8fafc;">
                                <td colspan="2" style="text-align: right; font-weight: bold;">Total Area:</td>
                                <td style="font-weight: bold; color: var(--blue-600);">${totalArea.toFixed(2)} m²</td>
                                <td colspan="3"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
            <h3>Program Ruang</h3>
            <button class="btn-primary" onclick="addZone()"><i data-lucide="plus" style="width: 16px;"></i> Tambah Zona</button>
        </div>
        ${zonesHTML}
    `;
}

// Spatial State Handlers
function addZone() {
    state.zones.push({ id: Date.now(), title: 'Zona Baru', circulationPercent: 20, rooms: [] });
    render();
}
function addRoom(zoneId) {
    const zone = state.zones.find(z => z.id === zoneId);
    if (zone) zone.rooms.push({ id: Date.now(), room: '', capacity: '', area: '0', needs: '', relations: '' });
    render();
}
function updateZone(zoneId, field, value) {
    const zone = state.zones.find(z => z.id === zoneId);
    if (zone) zone[field] = value;
    render();
}
function updateRoom(zoneId, roomId, field, value) {
    const zone = state.zones.find(z => z.id === zoneId);
    const room = zone.rooms.find(r => r.id === roomId);
    if (room) room[field] = value;
    render();
}
function removeRoom(zoneId, roomId) {
    const zone = state.zones.find(z => z.id === zoneId);
    if (zone) zone.rooms = zone.rooms.filter(r => r.id !== roomId);
    render();
}

// --- SETUP AWAL ---
function attachDynamicEventListeners() {
    // Event listener statis (Sidebar Mobile)
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    
    document.getElementById('open-mobile-menu')?.addEventListener('click', () => {
        sidebar.classList.add('open');
        overlay.classList.remove('hidden');
    });
    
    document.getElementById('close-mobile-menu')?.addEventListener('click', closeMenu);
    overlay?.addEventListener('click', closeMenu);

    function closeMenu() {
        sidebar.classList.remove('open');
        overlay.classList.add('hidden');
    }

    // Navigasi Sidebar
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.onclick = (e) => {
            navigateTo(e.currentTarget.dataset.target);
            closeMenu();
        };
    });
}

// Inisialisasi Pertama
document.addEventListener('DOMContentLoaded', () => {
    render();
});