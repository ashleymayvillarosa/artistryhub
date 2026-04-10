import { Link } from 'react-router-dom';
import { Palette, Users, Share2, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <Palette className="w-8 h-8 text-purple-300" />
          <span className="text-2xl font-bold text-white">ArtistryHub</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/gallery" className="text-purple-200 hover:text-white transition-colors">
            Gallery
          </Link>
          <Link
            to="/canvas"
            className="bg-purple-500 hover:bg-purple-400 text-white px-6 py-2 rounded-full transition-colors"
          >
            Start Drawing
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-8 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fadeIn">
          Create Art <span className="text-purple-300">Together</span>
        </h1>
        <p className="text-xl text-purple-200 max-w-2xl mb-10 animate-slideIn">
          A real-time collaborative drawing platform. Express your creativity,
          share your canvas, and create masterpieces with artists worldwide.
        </p>
        <div className="flex gap-4 animate-slideIn">
          <Link
            to="/canvas"
            className="bg-white text-purple-900 px-8 py-4 rounded-full font-semibold hover:bg-purple-100 transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Start Creating
          </Link>
          <Link
            to="/gallery"
            className="border-2 border-purple-300 text-purple-100 px-8 py-4 rounded-full font-semibold hover:bg-purple-800 transition-colors"
          >
            View Gallery
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-colors">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Powerful Canvas</h3>
            <p className="text-purple-200">
              Professional drawing tools with brushes, colors, layers, and more to bring your vision to life.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-colors">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Real-time Collaboration</h3>
            <p className="text-purple-200">
              Invite friends and collaborate in real-time with WebSocket-powered synchronization.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-colors">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Share2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Share & Export</h3>
            <p className="text-purple-200">
              Save your artwork, share it with the community, or export in various formats.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 text-purple-300">
        <p>&copy; 2026 ArtistryHub. Built with React, Canvas API & WebSocket.</p>
      </footer>
    </div>
  );
}
