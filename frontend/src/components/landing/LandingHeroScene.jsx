import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function LandingHeroScene({ onOpenAuth }) {
  return (
    <section id="beranda" className="hero-scene">
      <div className="hero-scene-inner">
        <div className="hero-copy">
          <span className="hero-eyebrow">
            <img src="/assets/preview-luna/assets/decorations/dekor_bintang_jatuh.png" alt="" />
            Teman bertumbuh setiap hari
          </span>
          <div className="hero-mark" aria-hidden="true">
            <svg viewBox="0 0 140 100" width="110" height="78" fill="none">
              <path d="M62 10C37 10 17 30 17 55s20 45 45 45c6 0 11-1 16-3-20-4-36-21-36-42S58 17 78 13c-5-2-10-3-16-3Z" fill="#2B2D5B" />
              <path d="m65 38 4 8 8 2-6 6 2 8-8-4-7 4 2-8-6-6 8-2z" fill="#FFE7B8" />
              <path d="M79 49c7-5 13-1 15 5-7 0-12-2-15-5Zm4 12c7-3 12 2 13 8-7 0-11-3-13-8Z" fill="#A9A8F5" />
            </svg>
          </div>
          <h1>Lentera untuk Nilai dan Asa</h1>
          <p>
            Teman curhat, ruang aman, dan dukungan untuk kamu yang sedang mencari arah. Kami ada, karena setiap langkahmu berarti.
          </p>
          <div className="hero-actions">
            <button type="button" className="hero-primary-button" onClick={() => onOpenAuth('register')}>
              Mulai Sekarang <ArrowRight size={17} />
            </button>
            <a className="hero-secondary-button" href="#tentang">
              Pelajari Lebih Lanjut
            </a>
          </div>
          <div className="hero-trust-note">
            <span>✦</span> Ruang aman, tanpa takut dihakimi
          </div>
        </div>
        <div className="hero-artwork">
          <div className="hero-art-glow" />
          <img className="hero-character" src="/assets/preview-luna/assets/mascot/mascot_full_body.png" alt="Maskot LUNA" />
          <img className="hero-cat-prop" src="/assets/preview-luna/assets/decorations/aksesoris_kucing_di_buku.png" alt="Kucing di atas buku" />
          <img className="hero-pencil-prop" src="/assets/preview-luna/assets/decorations/aksesoris_tempat_pensil.png" alt="" />
          <img className="hero-sparkle hero-sparkle-one" src="/assets/preview-luna/assets/decorations/ornamen_bintang_cluster_1.png" alt="" />
          <img className="hero-sparkle hero-sparkle-two" src="/assets/preview-luna/assets/decorations/ornamen_awan_lilac.png" alt="" />
          <div className="hero-note hero-note-one">Kamu tidak sendiri <span>♥</span></div>
          <div className="hero-note hero-note-two">Satu langkah kecil ✦</div>
        </div>
      </div>
      <div className="hero-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path d="M0,30 C210,90 380,5 620,48 C850,88 1080,15 1260,52 C1340,68 1390,65 1440,43 L1440,100 L0,100 Z" />
        </svg>
      </div>
    </section>
  );
}
