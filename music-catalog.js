// SoundWave Music Catalog JavaScript
class SoundWave {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('soundwave-favorites')) || [];
        this.musicCatalog = [];
        this.playlists = [];
        this.artists = [];
        this.currentView = 'grid';

        this.init();
    }

    init() {
        this.createMusicCatalog();
        this.createPlaylists();
        this.createArtists();
        this.setupEventListeners();
        this.renderCatalog();
        this.renderPlaylists();
        this.renderArtists();
        this.renderFeatured();
        this.updateFavoritesUI();
        this.setupSmoothScrolling();
    }

    createMusicCatalog() {
        this.musicCatalog = [
            // Pop Music
            {
                id: 1,
                title: "Blinding Lights",
                artist: "The Weeknd",
                genre: "pop",
                year: 2019,
                duration: "3:20",
                image: "🎵",
                spotifyId: "0VjIjW4GlUZAMYd2vXMi3b",
                youtubeId: "4NRXx6U8ABQ",
                soundcloudUrl: "https://soundcloud.com/theweeknd/blinding-lights",
                popular: true
            },
            {
                id: 2,
                title: "Watermelon Sugar",
                artist: "Harry Styles",
                genre: "pop",
                year: 2020,
                duration: "2:54",
                image: "🍉",
                spotifyId: "6UelLqGlWMcVH1E5c4H7lY",
                youtubeId: "E07s5ZYygMg",
                soundcloudUrl: "https://soundcloud.com/harrystyles/watermelon-sugar",
                popular: true
            },
            {
                id: 3,
                title: "Levitating",
                artist: "Dua Lipa",
                genre: "pop",
                year: 2020,
                duration: "3:23",
                image: "✨",
                spotifyId: "463CkQjx2Zk1yXoBuierM9",
                youtubeId: "TUVcZfQe-Kw",
                soundcloudUrl: "https://soundcloud.com/dualipa/levitating",
                popular: true
            },

            // Rock Music
            {
                id: 4,
                title: "Bohemian Rhapsody",
                artist: "Queen",
                genre: "rock",
                year: 1975,
                duration: "5:55",
                image: "👑",
                spotifyId: "4u7EnebtmKWzUH433cf5Qv",
                youtubeId: "fJ9rUzIMcZQ",
                soundcloudUrl: "https://soundcloud.com/queen-official/bohemian-rhapsody",
                popular: true
            },
            {
                id: 5,
                title: "Smells Like Teen Spirit",
                artist: "Nirvana",
                genre: "rock",
                year: 1991,
                duration: "5:01",
                image: "🎸",
                spotifyId: "4CeeEOM32jQcH3eN9Q2dGj",
                youtubeId: "hTWKbfoikeg",
                soundcloudUrl: "https://soundcloud.com/nirvana/smells-like-teen-spirit",
                popular: true
            },
            {
                id: 6,
                title: "Hotel California",
                artist: "Eagles",
                genre: "rock",
                year: 1976,
                duration: "6:30",
                image: "🏨",
                spotifyId: "40riOy7x9W7GXjyGp4pjAv",
                youtubeId: "09839DpTctU",
                soundcloudUrl: "https://soundcloud.com/eagles/hotel-california",
                popular: false
            },

            // Hip Hop
            {
                id: 7,
                title: "God's Plan",
                artist: "Drake",
                genre: "hip-hop",
                year: 2018,
                duration: "3:19",
                image: "🙏",
                spotifyId: "6DCZcSspjsKoFjzjrWoCdn",
                youtubeId: "xpVfcZ0ZcFM",
                soundcloudUrl: "https://soundcloud.com/octobersveryown/gods-plan",
                popular: true
            },
            {
                id: 8,
                title: "HUMBLE.",
                artist: "Kendrick Lamar",
                genre: "hip-hop",
                year: 2017,
                duration: "2:57",
                image: "🎤",
                spotifyId: "7KXjTSCq5nL1LoYtL7XAwS",
                youtubeId: "tvTRZJ-4EyI",
                soundcloudUrl: "https://soundcloud.com/kendrick-lamar-music/humble",
                popular: true
            },

            // Electronic
            {
                id: 9,
                title: "Strobe",
                artist: "Deadmau5",
                genre: "electronic",
                year: 2009,
                duration: "10:36",
                image: "🎛️",
                spotifyId: "7MXVkk9YMctZqd1Srtv4MB",
                youtubeId: "tKi9Z-f6qX4",
                soundcloudUrl: "https://soundcloud.com/deadmau5/strobe",
                popular: false
            },
            {
                id: 10,
                title: "Clarity",
                artist: "Zedd ft. Foxes",
                genre: "electronic",
                year: 2012,
                duration: "4:31",
                image: "💎",
                spotifyId: "3vdLVMw6aJmKwNcs5dBjWw",
                youtubeId: "IxxstCcJlsc",
                soundcloudUrl: "https://soundcloud.com/zedd/clarity-feat-foxes",
                popular: true
            },

            // Jazz
            {
                id: 11,
                title: "Take Five",
                artist: "Dave Brubeck Quartet",
                genre: "jazz",
                year: 1959,
                duration: "5:24",
                image: "🎺",
                spotifyId: "1YQWosTIljIvxAgHWTp7KP",
                youtubeId: "vmDDOFXSgAs",
                soundcloudUrl: "https://soundcloud.com/jazz-classics/take-five",
                popular: false
            },
            {
                id: 12,
                title: "Fly Me to the Moon",
                artist: "Frank Sinatra",
                genre: "jazz",
                year: 1964,
                duration: "2:28",
                image: "🌙",
                spotifyId: "5b7OOEXyNNhLNTbKYCgq0w",
                youtubeId: "5hxibHJOE5E",
                soundcloudUrl: "https://soundcloud.com/frank-sinatra/fly-me-to-the-moon",
                popular: true
            },

            // Classical
            {
                id: 13,
                title: "Symphony No. 9",
                artist: "Ludwig van Beethoven",
                genre: "classical",
                year: 1824,
                duration: "65:00",
                image: "🎻",
                spotifyId: "2Yb8ULz8LYvLOcFFBdZhfF",
                youtubeId: "t3217H8JppI",
                soundcloudUrl: "https://soundcloud.com/classical-music/beethoven-symphony-9",
                popular: false
            },

            // Indie
            {
                id: 14,
                title: "Electric Feel",
                artist: "MGMT",
                genre: "indie",
                year: 2007,
                duration: "3:49",
                image: "⚡",
                spotifyId: "3FtYbEfTbdJbJspb3ReNCX",
                youtubeId: "MmZexg8sxyk",
                soundcloudUrl: "https://soundcloud.com/mgmt/electric-feel",
                popular: false
            },

            // Country
            {
                id: 15,
                title: "Old Town Road",
                artist: "Lil Nas X",
                genre: "country",
                year: 2019,
                duration: "2:37",
                image: "🤠",
                spotifyId: "2YpeDb67231RjR0MgVLzsG",
                youtubeId: "w2Ov5jzm3j8",
                soundcloudUrl: "https://soundcloud.com/lilnasx/old-town-road",
                popular: true
            }
        ];
    }

    createPlaylists() {
        this.playlists = [
            {
                id: 1,
                title: "Today's Top Hits",
                description: "The most played songs right now",
                type: "Popular",
                image: "🔥",
                songCount: 50,
                spotifyPlaylistId: "37i9dQZF1DXcBWIGoYBM5M"
            },
            {
                id: 2,
                title: "Chill Vibes",
                description: "Relax and unwind with these mellow tracks",
                type: "Mood",
                image: "🌊",
                songCount: 35,
                spotifyPlaylistId: "37i9dQZF1DX4WYpdgoIcn6"
            },
            {
                id: 3,
                title: "Workout Motivation",
                description: "High-energy tracks to power your workout",
                type: "Fitness",
                image: "💪",
                songCount: 40,
                spotifyPlaylistId: "37i9dQZF1DX76Wlfdnj7AP"
            },
            {
                id: 4,
                title: "Classic Rock Legends",
                description: "Timeless rock anthems from the greatest bands",
                type: "Genre",
                image: "🎸",
                songCount: 60,
                spotifyPlaylistId: "37i9dQZF1DWXRqgorJj26U"
            },
            {
                id: 5,
                title: "Jazz Café",
                description: "Smooth jazz for a sophisticated atmosphere",
                type: "Mood",
                image: "☕",
                songCount: 25,
                spotifyPlaylistId: "37i9dQZF1DX0SM0LYsmbMT"
            },
            {
                id: 6,
                title: "Electronic Beats",
                description: "The best in electronic and dance music",
                type: "Genre",
                image: "🎛️",
                songCount: 45,
                spotifyPlaylistId: "37i9dQZF1DX4dyzvuaRJ0n"
            }
        ];
    }

    createArtists() {
        this.artists = [
            {
                id: 1,
                name: "The Weeknd",
                genre: "Pop/R&B",
                image: "🌟",
                monthlyListeners: "85M",
                topSong: "Blinding Lights"
            },
            {
                id: 2,
                name: "Drake",
                genre: "Hip Hop",
                image: "🎤",
                monthlyListeners: "75M",
                topSong: "God's Plan"
            },
            {
                id: 3,
                name: "Dua Lipa",
                genre: "Pop",
                image: "💃",
                monthlyListeners: "65M",
                topSong: "Levitating"
            },
            {
                id: 4,
                name: "Queen",
                genre: "Rock",
                image: "👑",
                monthlyListeners: "45M",
                topSong: "Bohemian Rhapsody"
            },
            {
                id: 5,
                name: "Kendrick Lamar",
                genre: "Hip Hop",
                image: "🏆",
                monthlyListeners: "55M",
                topSong: "HUMBLE."
            },
            {
                id: 6,
                name: "Deadmau5",
                genre: "Electronic",
                image: "🐭",
                monthlyListeners: "15M",
                topSong: "Strobe"
            }
        ];
    }

    setupEventListeners() {
        // Favorites functionality
        document.getElementById('favoritesBtn').addEventListener('click', () => this.toggleFavorites());
        document.getElementById('closeFavorites').addEventListener('click', () => this.toggleFavorites());

        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => this.searchMusic());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchMusic();
        });

        // Filter functionality
        document.getElementById('genreFilter').addEventListener('change', () => this.filterMusic());
        document.getElementById('sortFilter').addEventListener('change', () => this.sortMusic());
        document.getElementById('viewToggle').addEventListener('click', () => this.toggleView());

        // Genre cards
        document.querySelectorAll('.genre-card').forEach(card => {
            card.addEventListener('click', () => {
                const genre = card.dataset.genre;
                document.getElementById('genreFilter').value = genre;
                this.filterMusic();
                this.scrollToSection('catalog');
            });
        });

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                this.scrollToSection(target);
                this.setActiveNavLink(link);
            });
        });

        // Mobile menu toggle
        document.getElementById('menuToggle').addEventListener('click', () => this.toggleMobileMenu());

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModals();
            }
        });

        // Player modal
        document.getElementById('closePlayer').addEventListener('click', () => this.closeModals());
    }

    renderCatalog(items = this.musicCatalog) {
        const catalogGrid = document.getElementById('catalogGrid');
        catalogGrid.innerHTML = '';

        items.forEach(song => {
            const songCard = this.createMusicCard(song);
            catalogGrid.appendChild(songCard);
        });
    }

    createMusicCard(song) {
        const card = document.createElement('div');
        card.className = 'music-card';

        const isFavorite = this.favorites.some(fav => fav.id === song.id);

        card.innerHTML = `
            <div class="music-card-image">
                <span style="font-size: 4rem;">${song.image}</span>
                <button class="play-overlay" onclick="musicApp.playMusic(${song.id})">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <div class="music-card-info">
                <div class="music-card-genre">${song.genre}</div>
                <div class="music-card-title">${song.title}</div>
                <div class="music-card-artist">${song.artist}</div>
                <div class="music-card-footer">
                    <div class="music-card-year">${song.year} • ${song.duration}</div>
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" onclick="musicApp.toggleFavorite(${song.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    renderPlaylists() {
        const playlistsGrid = document.getElementById('playlistsGrid');
        playlistsGrid.innerHTML = '';

        this.playlists.forEach(playlist => {
            const playlistCard = this.createPlaylistCard(playlist);
            playlistsGrid.appendChild(playlistCard);
        });
    }

    createPlaylistCard(playlist) {
        const card = document.createElement('div');
        card.className = 'playlist-card';

        card.innerHTML = `
            <div class="playlist-card-image">
                <span style="font-size: 4rem;">${playlist.image}</span>
                <button class="play-overlay" onclick="musicApp.playPlaylist(${playlist.id})">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <div class="playlist-card-info">
                <div class="playlist-card-type">${playlist.type}</div>
                <div class="playlist-card-title">${playlist.title}</div>
                <div class="playlist-card-description">${playlist.description}</div>
                <div class="playlist-card-footer">
                    <div class="playlist-card-count">${playlist.songCount} songs</div>
                </div>
            </div>
        `;

        return card;
    }

    renderArtists() {
        const artistsGrid = document.getElementById('artistsGrid');
        artistsGrid.innerHTML = '';

        this.artists.forEach(artist => {
            const artistCard = this.createArtistCard(artist);
            artistsGrid.appendChild(artistCard);
        });
    }

    createArtistCard(artist) {
        const card = document.createElement('div');
        card.className = 'artist-card';

        card.innerHTML = `
            <div class="artist-card-image">
                <span style="font-size: 4rem;">${artist.image}</span>
                <button class="play-overlay" onclick="musicApp.playArtist(${artist.id})">
                    <i class="fas fa-play"></i>
                </button>
            </div>
            <div class="artist-card-info">
                <div class="artist-card-name">${artist.name}</div>
                <div class="artist-card-genre">${artist.genre}</div>
                <div class="artist-card-stats">
                    <div>${artist.monthlyListeners} monthly listeners</div>
                    <div>Top song: ${artist.topSong}</div>
                </div>
            </div>
        `;

        return card;
    }

    renderFeatured() {
        const featuredGrid = document.getElementById('featuredGrid');
        const featuredSongs = this.musicCatalog.filter(song => song.popular).slice(0, 6);

        featuredSongs.forEach(song => {
            const songCard = this.createMusicCard(song);
            featuredGrid.appendChild(songCard);
        });
    }

    playMusic(songId) {
        const song = this.musicCatalog.find(s => s.id === songId);
        if (!song) return;

        this.showPlayer(song);
        this.showToast(`Now playing: ${song.title} by ${song.artist}`);
    }

    playPlaylist(playlistId) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        if (!playlist) return;

        this.showPlaylistPlayer(playlist);
        this.showToast(`Playing playlist: ${playlist.title}`);
    }

    playArtist(artistId) {
        const artist = this.artists.find(a => a.id === artistId);
        if (!artist) return;

        this.showToast(`Playing top songs by ${artist.name}`);
    }

    showPlayer(song) {
        const playerModal = document.getElementById('playerModal');
        const playerTitle = document.getElementById('playerTitle');
        const playerContent = document.getElementById('playerContent');

        playerTitle.textContent = `${song.title} - ${song.artist}`;

        // Create multiple iframe options for the user to choose from
        playerContent.innerHTML = `
            <div class="player-info">
                <div style="font-size: 4rem; margin-bottom: 1rem;">${song.image}</div>
                <h3 style="color: #4ecdc4; margin-bottom: 0.5rem;">${song.title}</h3>
                <p style="color: #b8c6db; margin-bottom: 2rem;">${song.artist} • ${song.year} • ${song.duration}</p>
            </div>
            
            <div class="player-options">
                <h4 style="color: #4ecdc4; margin-bottom: 1rem;">Choose your preferred platform:</h4>
                
                <div class="platform-tabs">
                    <button class="platform-tab active" onclick="musicApp.switchPlatform('spotify', ${song.id})">
                        <i class="fab fa-spotify"></i> Spotify
                    </button>
                    <button class="platform-tab" onclick="musicApp.switchPlatform('youtube', ${song.id})">
                        <i class="fab fa-youtube"></i> YouTube
                    </button>
                    <button class="platform-tab" onclick="musicApp.switchPlatform('soundcloud', ${song.id})">
                        <i class="fab fa-soundcloud"></i> SoundCloud
                    </button>
                </div>
                
                <div class="player-iframe-container" id="playerIframe">
                    <iframe 
                        src="https://open.spotify.com/embed/track/${song.spotifyId}?utm_source=generator&theme=0" 
                        width="100%" 
                        height="352" 
                        frameBorder="0" 
                        allowfullscreen="" 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy">
                    </iframe>
                </div>
            </div>
        `;

        playerModal.classList.add('show');
    }

    showPlaylistPlayer(playlist) {
        const playerModal = document.getElementById('playerModal');
        const playerTitle = document.getElementById('playerTitle');
        const playerContent = document.getElementById('playerContent');

        playerTitle.textContent = playlist.title;

        playerContent.innerHTML = `
            <div class="player-info">
                <div style="font-size: 4rem; margin-bottom: 1rem;">${playlist.image}</div>
                <h3 style="color: #4ecdc4; margin-bottom: 0.5rem;">${playlist.title}</h3>
                <p style="color: #b8c6db; margin-bottom: 2rem;">${playlist.description} • ${playlist.songCount} songs</p>
            </div>
            
            <div class="player-iframe-container">
                <iframe 
                    src="https://open.spotify.com/embed/playlist/${playlist.spotifyPlaylistId}?utm_source=generator&theme=0" 
                    width="100%" 
                    height="352" 
                    frameBorder="0" 
                    allowfullscreen="" 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy">
                </iframe>
            </div>
        `;

        playerModal.classList.add('show');
    }

    switchPlatform(platform, songId) {
        const song = this.musicCatalog.find(s => s.id === songId);
        if (!song) return;

        // Update active tab
        document.querySelectorAll('.platform-tab').forEach(tab => tab.classList.remove('active'));
        event.target.classList.add('active');

        const playerIframe = document.getElementById('playerIframe');

        switch (platform) {
            case 'spotify':
                playerIframe.innerHTML = `
                    <iframe 
                        src="https://open.spotify.com/embed/track/${song.spotifyId}?utm_source=generator&theme=0" 
                        width="100%" 
                        height="352" 
                        frameBorder="0" 
                        allowfullscreen="" 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                        loading="lazy">
                    </iframe>
                `;
                break;
            case 'youtube':
                playerIframe.innerHTML = `
                    <iframe 
                        width="100%" 
                        height="352" 
                        src="https://www.youtube.com/embed/${song.youtubeId}" 
                        title="YouTube video player" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                `;
                break;
            case 'soundcloud':
                playerIframe.innerHTML = `
                    <iframe 
                        width="100%" 
                        height="352" 
                        scrolling="no" 
                        frameborder="no" 
                        allow="autoplay" 
                        src="https://w.soundcloud.com/player/?url=${encodeURIComponent(song.soundcloudUrl)}&color=%234ecdc4&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true">
                    </iframe>
                `;
                break;
        }
    }

    toggleFavorite(songId) {
        const song = this.musicCatalog.find(s => s.id === songId);
        if (!song) return;

        const existingIndex = this.favorites.findIndex(fav => fav.id === songId);

        if (existingIndex > -1) {
            this.favorites.splice(existingIndex, 1);
            this.showToast(`Removed ${song.title} from favorites`);
        } else {
            this.favorites.push(song);
            this.showToast(`Added ${song.title} to favorites`);
        }

        this.saveFavorites();
        this.updateFavoritesUI();
        this.renderCatalog(); // Re-render to update heart icons
    }

    toggleFavorites() {
        const favoritesModal = document.getElementById('favoritesModal');
        favoritesModal.classList.toggle('show');

        if (favoritesModal.classList.contains('show')) {
            this.renderFavorites();
        }
    }

    renderFavorites() {
        const favoritesContent = document.getElementById('favoritesContent');

        if (this.favorites.length === 0) {
            favoritesContent.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #b8c6db;">
                    <i class="fas fa-heart" style="font-size: 3rem; margin-bottom: 1rem; color: #666;"></i>
                    <p>No favorites yet</p>
                    <p style="font-size: 0.9rem; margin-top: 0.5rem;">Start adding songs to your favorites!</p>
                </div>
            `;
            return;
        }

        favoritesContent.innerHTML = '';

        this.favorites.forEach(song => {
            const favoriteItem = document.createElement('div');
            favoriteItem.className = 'favorite-item';
            favoriteItem.innerHTML = `
                <div class="favorite-item-image">
                    <span style="font-size: 1.5rem;">${song.image}</span>
                </div>
                <div class="favorite-item-info">
                    <div class="favorite-item-title">${song.title}</div>
                    <div class="favorite-item-artist">${song.artist} • ${song.year}</div>
                </div>
                <button class="favorite-btn active" onclick="musicApp.toggleFavorite(${song.id})">
                    <i class="fas fa-heart"></i>
                </button>
                <button class="play-overlay" onclick="musicApp.playMusic(${song.id}); musicApp.toggleFavorites();" style="position: static; opacity: 1; width: 40px; height: 40px; font-size: 1rem;">
                    <i class="fas fa-play"></i>
                </button>
            `;
            favoritesContent.appendChild(favoriteItem);
        });
    }

    searchMusic() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();

        if (searchTerm === '') {
            this.renderCatalog();
            return;
        }

        const filteredSongs = this.musicCatalog.filter(song =>
            song.title.toLowerCase().includes(searchTerm) ||
            song.artist.toLowerCase().includes(searchTerm) ||
            song.genre.toLowerCase().includes(searchTerm)
        );

        this.renderCatalog(filteredSongs);
        this.scrollToSection('catalog');

        if (filteredSongs.length === 0) {
            this.showToast('No songs found matching your search');
        } else {
            this.showToast(`Found ${filteredSongs.length} songs`);
        }
    }

    filterMusic() {
        const genre = document.getElementById('genreFilter').value;

        if (genre === 'all') {
            this.renderCatalog();
        } else {
            const filteredSongs = this.musicCatalog.filter(song => song.genre === genre);
            this.renderCatalog(filteredSongs);
        }
    }

    sortMusic() {
        const sortBy = document.getElementById('sortFilter').value;
        let sortedSongs = [...this.musicCatalog];

        switch (sortBy) {
            case 'title':
                sortedSongs.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'artist':
                sortedSongs.sort((a, b) => a.artist.localeCompare(b.artist));
                break;
            case 'year':
                sortedSongs.sort((a, b) => b.year - a.year);
                break;
            case 'popularity':
                sortedSongs.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
                break;
            default:
                sortedSongs = this.musicCatalog;
        }

        this.renderCatalog(sortedSongs);
    }

    toggleView() {
        const catalogGrid = document.getElementById('catalogGrid');
        const viewToggle = document.getElementById('viewToggle');

        if (this.currentView === 'grid') {
            this.currentView = 'list';
            catalogGrid.classList.add('list-view');
            viewToggle.innerHTML = '<i class="fas fa-th-large"></i>';
        } else {
            this.currentView = 'grid';
            catalogGrid.classList.remove('list-view');
            viewToggle.innerHTML = '<i class="fas fa-list"></i>';
        }
    }

    updateFavoritesUI() {
        const favoritesCount = document.getElementById('favoritesCount');
        favoritesCount.textContent = this.favorites.length;
    }

    saveFavorites() {
        localStorage.setItem('soundwave-favorites', JSON.stringify(this.favorites));
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');

        toastMessage.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
        });
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = section.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    setActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    setupSmoothScrolling() {
        // Update active nav link on scroll
        window.addEventListener('scroll', () => {
            const sections = ['home', 'featured', 'genres', 'catalog', 'playlists', 'artists'];
            const headerHeight = document.querySelector('.header').offsetHeight;

            let currentSection = '';

            sections.forEach(sectionId => {
                const section = document.getElementById(sectionId);
                if (section) {
                    const sectionTop = section.offsetTop - headerHeight - 100;
                    const sectionBottom = sectionTop + section.offsetHeight;

                    if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                        currentSection = sectionId;
                    }
                }
            });

            if (currentSection) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentSection}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    toggleMobileMenu() {
        this.showToast('Mobile menu - Feature coming soon!');
    }
}

// Global functions for onclick handlers
function scrollToSection(sectionId) {
    musicApp.scrollToSection(sectionId);
}

// Initialize the music app
const musicApp = new SoundWave();

// Add platform tab styles
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .player-options {
            margin-top: 2rem;
        }
        
        .platform-tabs {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .platform-tab {
            background: transparent;
            border: 2px solid #4ecdc4;
            color: #4ecdc4;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .platform-tab:hover,
        .platform-tab.active {
            background: #4ecdc4;
            color: #0a0a0a;
        }
        
        .player-iframe-container {
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .player-info {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        @media (max-width: 768px) {
            .platform-tabs {
                flex-direction: column;
                align-items: center;
            }
            
            .platform-tab {
                width: 200px;
                justify-content: center;
            }
        }
    `;
    document.head.appendChild(style);
});