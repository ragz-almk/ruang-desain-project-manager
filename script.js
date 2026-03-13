// --- UPDATE FUNGSI NAVIGASI & DIRECTORY ---
        
        // Ganti fungsi navigateTo yang lama dengan ini
        function navigateTo(view) {
            currentView = view;
            if (isMobileMenuOpen) toggleMobileMenu();

            document.getElementById('view-dashboard').classList.add('hidden');
            document.getElementById('view-directory').classList.add('hidden');
            document.getElementById('view-project-detail').classList.add('hidden');
            document.getElementById('view-project-detail').classList.remove('flex'); // Kembalikan ke display block/hidden standar

            document.getElementById('nav-dashboard').className = "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-slate-800 hover:text-white";
            document.getElementById('nav-directory').className = "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-slate-800 hover:text-white";

            if(view === 'dashboard') {
                document.getElementById('view-dashboard').classList.remove('hidden');
                document.getElementById('nav-dashboard').className = "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-blue-600 text-white";
            } else if(view === 'directory') {
                document.getElementById('view-directory').classList.remove('hidden');
                document.getElementById('nav-directory').className = "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-blue-600 text-white";
            }
            lucide.createIcons();
        }

        // Ganti fungsi renderDirectory yang lama dengan ini agar card bisa di klik
        function renderDirectory() {
            const grid = document.getElementById('directory-grid');
            grid.innerHTML = mockProjects.map(project => {
                let statusClass = project.status === 'Ongoing' ? 'bg-blue-100 text-blue-700' : project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700';
                let progressClass = project.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500';

                // Perhatikan: onclick="openProjectDetail(${project.id})"
                return `
                <div class="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col" onclick="openProjectDetail(${project.id})">
                    <div class="p-4 md:p-5 flex-1">
                        <div class="flex justify-between items-start mb-2 md:mb-3">
                            <span class="text-[10px] md:text-xs font-bold px-2 py-1 rounded-md ${statusClass}">${project.status}</span>
                            <button class="text-slate-400 hover:text-slate-600 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity p-1 -mr-1">
                                <i data-lucide="more-vertical" class="w-4 h-4"></i>
                            </button>
                        </div>
                        <h3 class="text-base md:text-lg font-bold text-slate-900 mb-1 leading-tight">${project.name}</h3>
                        <p class="text-xs md:text-sm text-slate-500 mb-3 md:mb-4 line-clamp-2">${project.description}</p>
                        <div class="space-y-1.5 md:space-y-2 mb-2">
                            <div class="flex items-center gap-2 text-xs md:text-sm text-slate-600">
                                <i data-lucide="user" class="w-3.5 h-3.5 text-slate-400 shrink-0"></i> <span class="truncate">${project.client}</span>
                            </div>
                            <div class="flex items-center gap-2 text-xs md:text-sm text-slate-600">
                                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-400 shrink-0"></i> <span class="truncate">${project.location}</span>
                            </div>
                        </div>
                    </div>
                    <div class="px-4 md:px-5 py-3 md:py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
                        <div class="flex justify-between items-center mb-1.5">
                            <span class="text-[10px] md:text-xs font-medium text-slate-500">Progres</span>
                            <span class="text-[10px] md:text-xs font-bold text-slate-700">${project.progress}%</span>
                        </div>
                        <div class="w-full bg-slate-200 rounded-full h-1.5">
                            <div class="h-1.5 rounded-full ${progressClass}" style="width: ${project.progress}%"></div>
                        </div>
                    </div>
                </div>
                `;
            }).join('');
        }

        // --- PROJECT DETAIL LOGIC ---
        let currentProject = null;
        let activeTab = 'overview';
        
        // Data State untuk Program Ruang (Tabel Dinamis)
        let spatialZones = [
            { id: 1, title: 'Zona Publik', circulationPercent: 20, rooms: [ { id: 1, room: 'Ruang Keluarga', capacity: '6-8', area: '45', needs: 'Pencahayaan alami', relations: 'Dapur' } ] },
            { id: 2, title: 'Zona Privat', circulationPercent: 15, rooms: [ { id: 2, room: 'Kamar Tidur Utama', capacity: '2', area: '30', needs: 'Kedap suara', relations: 'KM Utama' } ] }
        ];

        const tabs = [
            { id: 'overview', label: 'Ikhtisar', icon: 'file-text' },
            { id: 'tasks', label: 'Tugas & Linimasa', icon: 'list-todo' },
            { id: 'spatial', label: 'Program Ruang', icon: 'grid' },
            { id: 'concept', label: 'Konsep', icon: 'image' },
            { id: 'vault', label: 'Berkas', icon: 'hard-drive' },
        ];

        function openProjectDetail(projectId) {
            currentProject = mockProjects.find(p => p.id === projectId);
            if(!currentProject) return;

            // Update UI Header
            document.getElementById('pd-title').innerText = currentProject.name;
            document.getElementById('pd-subtitle').innerText = `${currentProject.type} • ${currentProject.location}`;
            
            const statusBadge = document.getElementById('pd-status');
            statusBadge.innerText = currentProject.status;
            statusBadge.className = `text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-md ${currentProject.status === 'Ongoing' ? 'bg-blue-100 text-blue-700' : currentProject.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`;

            // Reset tab ke overview dan tampilkan halaman
            switchTab('overview');
            
            // Sembunyikan view lain dan tampilkan detail (harus class 'flex' bukan 'block' agar layout kolomnya rapi)
            document.getElementById('view-dashboard').classList.add('hidden');
            document.getElementById('view-directory').classList.add('hidden');
            const pdView = document.getElementById('view-project-detail');
            pdView.classList.remove('hidden');
            pdView.classList.add('flex');
            
            // Set navigasi direktori aktif
            document.getElementById('nav-directory').className = "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-blue-600 text-white";
            document.getElementById('nav-dashboard').className = "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-slate-800 hover:text-white";
        }

        function switchTab(tabId) {
            activeTab = tabId;
            
            // Render tombol tab
            const tabNav = document.getElementById('tab-navigation');
            tabNav.innerHTML = tabs.map(tab => {
                const isActive = activeTab === tab.id;
                const baseClass = "flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2.5 md:py-3 border-b-2 font-medium text-xs md:text-sm whitespace-nowrap transition-colors shrink-0";
                const activeClass = isActive ? "border-blue-600 text-blue-600 bg-blue-50/50" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300";
                return `<button onclick="switchTab('${tab.id}')" class="${baseClass} ${activeClass}"><i data-lucide="${tab.icon}" class="w-4 h-4 md:w-[18px] md:h-[18px]"></i> ${tab.label}</button>`;
            }).join('');

            // Sembunyikan semua tab content
            tabs.forEach(tab => {
                document.getElementById(`tab-${tab.id}`).classList.add('hidden');
            });

            // Tampilkan tab terpilih dan panggil fungsi render spesifiknya
            document.getElementById(`tab-${tabId}`).classList.remove('hidden');
            
            if(tabId === 'overview') renderTabOverview();
            if(tabId === 'spatial') renderTabSpatial();
            // (Untuk efisiensi demonstrasi, Tasks, Concept, dan Vault bisa ditambahkan HTML statisnya nanti di dalam div masing-masing)

            lucide.createIcons();
        }

        function renderTabOverview() {
            const container = document.getElementById('tab-overview');
            container.innerHTML = `
                <div class="space-y-6 md:space-y-8">
                    <div>
                        <h3 class="text-base md:text-lg font-bold text-slate-900 mb-2">Deskripsi Proyek</h3>
                        <p class="text-sm md:text-base text-slate-600 leading-relaxed max-w-4xl">${currentProject.description} Proyek ini menargetkan efisiensi ruang maksimal dengan estetika yang sesuai dengan preferensi klien.</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        <div class="bg-slate-50 p-4 md:p-5 rounded-xl border border-slate-100">
                            <h4 class="font-semibold text-slate-900 mb-3 md:mb-4 flex items-center gap-2"><i data-lucide="user" class="w-4 h-4 text-slate-400"></i> Informasi Klien</h4>
                            <div class="space-y-3">
                                <div><p class="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider">Nama Klien / Perusahaan</p><p class="text-sm md:text-base text-slate-800 font-medium">${currentProject.client}</p></div>
                                <div><p class="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider">Kontak Utama</p><p class="text-sm md:text-base text-slate-800 font-medium">0812-3456-7890</p></div>
                            </div>
                        </div>
                        <div class="bg-slate-50 p-4 md:p-5 rounded-xl border border-slate-100">
                            <h4 class="font-semibold text-slate-900 mb-3 md:mb-4 flex items-center gap-2"><i data-lucide="map-pin" class="w-4 h-4 text-slate-400"></i> Detail Lokasi & Waktu</h4>
                            <div class="space-y-3">
                                <div><p class="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider">Alamat Tapak</p><p class="text-sm md:text-base text-slate-800 font-medium">${currentProject.location}</p></div>
                                <div><p class="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider">Tenggat Waktu Utama</p><p class="text-sm md:text-base text-slate-800 font-medium">${currentProject.deadline}</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // --- SPATIAL TAB LOGIC (DYNAMIC TABLE) ---
        function renderTabSpatial() {
            const container = document.getElementById('tab-spatial');
            
            let zonesHTML = spatialZones.map(zone => {
                const subTotal = zone.rooms.reduce((sum, room) => sum + (parseFloat(room.area) || 0), 0);
                const sirkulasiArea = subTotal * (parseFloat(zone.circulationPercent) || 0) / 100;
                const totalArea = subTotal + sirkulasiArea;

                let roomsHTML = zone.rooms.map(item => `
                    <tr class="hover:bg-slate-50/30 transition-colors">
                        <td class="px-4 py-2"><input type="text" value="${item.room}" oninput="updateRoomField(${zone.id}, ${item.id}, 'room', this.value)" class="w-full bg-transparent border-none outline-none focus:bg-white focus:ring-1 focus:ring-slate-200 rounded px-1" placeholder="Nama..." /></td>
                        <td class="px-4 py-2"><div class="flex items-center gap-1"><input type="text" value="${item.capacity}" oninput="updateRoomField(${zone.id}, ${item.id}, 'capacity', this.value)" class="w-12 bg-transparent border-none outline-none focus:bg-white focus:ring-1 focus:ring-slate-200 rounded px-1" placeholder="0" /><span class="text-xs text-slate-400">org</span></div></td>
                        <td class="px-4 py-2"><input type="number" value="${item.area}" oninput="updateRoomField(${zone.id}, ${item.id}, 'area', this.value)" class="w-16 bg-transparent border-none outline-none focus:bg-white focus:ring-1 focus:ring-slate-200 rounded px-1" placeholder="0" /></td>
                        <td class="px-4 py-2"><input type="text" value="${item.needs}" oninput="updateRoomField(${zone.id}, ${item.id}, 'needs', this.value)" class="w-full bg-transparent border-none outline-none focus:bg-white focus:ring-1 focus:ring-slate-200 rounded px-1" placeholder="-" /></td>
                        <td class="px-4 py-2"><input type="text" value="${item.relations}" oninput="updateRoomField(${zone.id}, ${item.id}, 'relations', this.value)" class="w-full bg-transparent border-none outline-none focus:bg-white focus:ring-1 focus:ring-slate-200 rounded px-1" placeholder="-" /></td>
                        <td class="px-4 py-2 text-center"><button onclick="removeRoom(${zone.id}, ${item.id})" class="text-slate-400 hover:text-red-500 p-1"><i data-lucide="trash-2" class="w-4 h-4"></i></button></td>
                    </tr>
                `).join('');

                return `
                <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm mb-8">
                    <div class="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div class="flex-1 flex items-center">
                            <input type="text" value="${zone.title}" oninput="updateZoneField(${zone.id}, 'title', this.value)" class="font-bold text-slate-800 text-sm md:text-base bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-100 rounded px-1 w-full max-w-xs" placeholder="Nama Zona..." />
                        </div>
                        <button onclick="addRoom(${zone.id})" class="text-xs bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium px-3 py-1.5 rounded-md transition-colors flex items-center gap-1 w-fit">
                            <i data-lucide="plus" class="w-3.5 h-3.5"></i> Baris Baru
                        </button>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs md:text-sm text-slate-600 min-w-[700px]">
                            <thead class="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-200">
                                <tr>
                                    <th class="px-4 py-2.5 w-[20%]">Nama Ruang</th>
                                    <th class="px-4 py-2.5 w-[12%]">Kapasitas</th>
                                    <th class="px-4 py-2.5 w-[12%]">Luasan (m²)</th>
                                    <th class="px-4 py-2.5 w-[25%]">Kebutuhan Khusus</th>
                                    <th class="px-4 py-2.5 w-[25%]">Hubungan Ruang</th>
                                    <th class="px-4 py-2.5 w-[6%] text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100">
                                ${roomsHTML}
                                <tr class="bg-slate-50/50">
                                    <td colSpan="2" class="px-4 py-2 text-right text-xs font-medium text-slate-500">Subtotal Luasan Ruang:</td>
                                    <td class="px-4 py-2 font-medium text-slate-700">${subTotal.toFixed(2)} m²</td>
                                    <td colSpan="3"></td>
                                </tr>
                                <tr class="bg-slate-50/50">
                                    <td colSpan="2" class="px-4 py-2 text-right text-xs font-medium text-slate-500 flex items-center justify-end gap-2">
                                        <span>Sirkulasi:</span>
                                        <div class="flex items-center bg-white border border-slate-200 rounded px-2 py-0.5 w-16">
                                            <input type="number" value="${zone.circulationPercent}" oninput="updateZoneField(${zone.id}, 'circulationPercent', this.value)" class="w-full text-xs text-slate-700 outline-none text-right pr-1" />
                                            <span class="text-[10px] text-slate-400">%</span>
                                        </div>
                                    </td>
                                    <td class="px-4 py-2 font-medium text-slate-500">+${sirkulasiArea.toFixed(2)} m²</td>
                                    <td colSpan="3"></td>
                                </tr>
                                <tr class="bg-slate-50/80 border-t border-slate-200">
                                    <td colSpan="2" class="px-4 py-3 text-right font-bold text-slate-800">Total Luasan ${zone.title}:</td>
                                    <td class="px-4 py-3 font-bold text-blue-600 text-base">${totalArea.toFixed(2)} m²</td>
                                    <td colSpan="3"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>`;
            }).join('');

            container.innerHTML = `
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                    <div><h3 class="text-base md:text-lg font-bold text-slate-900">Program Ruang</h3><p class="text-xs md:text-sm text-slate-500">Estimasi luasan dan kebutuhan fungsi ruangan per zona.</p></div>
                    <button onclick="addZone()" class="text-xs md:text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
                        <i data-lucide="plus" class="w-4 h-4"></i> Tambah Zona Baru
                    </button>
                </div>
                ${zonesHTML}
            `;
            
            lucide.createIcons();
        }

        // --- MANAJEMEN STATE PROGRAM RUANG ---
        function addZone() {
            spatialZones.push({ id: Date.now(), title: 'Zona Baru', circulationPercent: 20, rooms: [] });
            renderTabSpatial();
        }

        function addRoom(zoneId) {
            const zone = spatialZones.find(z => z.id === zoneId);
            if(zone) {
                zone.rooms.push({ id: Date.now(), room: '', capacity: '', area: '0', needs: '', relations: '' });
                renderTabSpatial();
            }
        }

        function updateZoneField(zoneId, field, value) {
            const zone = spatialZones.find(z => z.id === zoneId);
            if(zone) {
                zone[field] = value;
                // Kita gunakan timeout atau re-render langsung untuk update perhitungan m2 
                renderTabSpatial();
                
                // UX Tweak: Fokus kembali ke input setelah render (Karena innerHTML mere-render ulang seluruh elemen)
                // Ini sedikit sulit di vanilla JS tanpa VDOM, jadi saya menggunakan event oninput yang memicu render penuh.
                // Jika ingin fokus tidak hilang, di proyek nyata sebaiknya manipulasi DOM per node, bukan innerHTML.
            }
        }

        function updateRoomField(zoneId, roomId, field, value) {
            const zone = spatialZones.find(z => z.id === zoneId);
            if(zone) {
                const room = zone.rooms.find(r => r.id === roomId);
                if(room) {
                    room[field] = value;
                    if(field === 'area') renderTabSpatial(); // Hanya render ulang penuh jika merubah angka luas/kalkulasi
                }
            }
        }

        function removeRoom(zoneId, roomId) {
            const zone = spatialZones.find(z => z.id === zoneId);
            if(zone) {
                zone.rooms = zone.rooms.filter(r => r.id !== roomId);
                renderTabSpatial();
            }
        }