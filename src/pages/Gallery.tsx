import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Palette, Heart, Eye, Download, Search, Filter } from 'lucide-react';

interface Artwork {
  id: number;
  title: string;
  artist: string;
  imageUrl: string;
  likes: number;
  views: number;
  category: string;
}

export default function Gallery() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Abstract', 'Portrait', 'Landscape', 'Digital', 'Sketch'];

  // Demo artworks
  const artworks: Artwork[] = [
    { id: 1, title: 'Cosmic Dreams', artist: 'Luna M.', imageUrl: '', likes: 234, views: 1205, category: 'Abstract' },
    { id: 2, title: 'Mountain Sunrise', artist: 'Alex K.', imageUrl: '', likes: 189, views: 892, category: 'Landscape' },
    { id: 3, title: 'Digital Portrait', artist: 'Sam T.', imageUrl: '', likes: 312, views: 1543, category: 'Portrait' },
    { id: 4, title: 'Neon City', artist: 'Maya R.', imageUrl: '', likes: 456, views: 2100, category: 'Digital' },
    { id: 5, title: 'Quick Sketch', artist: 'Chris L.', imageUrl: '', likes: 98, views: 432, category: 'Sketch' },
    { id: 6, title: 'Ocean Waves', artist: 'Jordan P.', imageUrl: '', likes: 267, views: 1320, category: 'Landscape' },
  ];

  const filteredArtworks = artworks.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         art.artist.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-2">
          <Palette className="w-8 h-8 text-purple-400" />
          <span className="text-2xl font-bold text-white">ArtistryHub</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/gallery" className="text-purple-300 font-medium">Gallery</Link>
          <Link
            to="/canvas"
            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-full transition-colors"
          >
            Start Drawing
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="px-8 py-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Community Gallery</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Explore amazing artwork created by our community of artists from around the world.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="px-8 mb-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search artworks or artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="px-8 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtworks.map(artwork => (
            <div
              key={artwork.id}
              className="group bg-gray-800 rounded-2xl overflow-hidden hover:ring-2 hover:ring-purple-500 transition-all"
            >
              {/* Placeholder for artwork image */}
              <div className="aspect-square bg-gradient-to-br from-purple-600 to-pink-600 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Palette className="w-16 h-16 text-white/30" />
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                    <Eye className="w-5 h-5 text-white" />
                  </button>
                  <button className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                    <Download className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-white font-semibold mb-1">{artwork.title}</h3>
                <p className="text-gray-400 text-sm mb-3">by {artwork.artist}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 bg-purple-900/50 text-purple-300 rounded-full">
                    {artwork.category}
                  </span>
                  <div className="flex items-center gap-4 text-gray-400 text-sm">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" /> {artwork.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" /> {artwork.views}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
