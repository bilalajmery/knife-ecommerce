"use client";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function AboutPage() {
  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-primary selection:text-white">
      <Navbar />

      {/* Header */}
      <div className="relative py-32 mb-12 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-knife.png"
            alt="About Header"
            fill
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav className="flex justify-center items-center text-sm text-gray-400 mb-6 uppercase tracking-widest">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="mx-3 text-gray-600">/</span>
            <span className="text-white font-bold">About</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
            Our <span className="text-primary">Legacy</span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Forging excellence since 1985. We blend traditional craftsmanship
            with modern innovation.
          </p>
        </div>
      </div>

      <main>
        {/* Story Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] rounded-lg overflow-hidden border border-gray-800 group">
              <Image
                src="/hero-tactical.png"
                alt="Craftsmanship"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6">
                The Art of <span className="text-primary">The Blade</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                At KnifeMaster, we believe that a knife is more than just a
                tool—it's an extension of the hand and a testament to human
                ingenuity. Our journey began in a small workshop with a single
                anvil and a burning passion for metallurgy.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Today, we collaborate with master bladesmiths from around the
                world to bring you instruments of unparalleled precision.
                Whether it's 67-layer Damascus steel or ultra-durable tactical
                alloys, every blade we forge tells a story of dedication and
                uncompromising quality.
              </p>
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-4xl font-black text-white mb-2">35+</h4>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">
                    Years Experience
                  </p>
                </div>
                <div>
                  <h4 className="text-4xl font-black text-white mb-2">10k+</h4>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">
                    Blades Forged
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="relative py-32 bg-black overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl mix-blend-screen" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl mix-blend-screen" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <span className="text-primary font-bold uppercase tracking-widest text-sm mb-4 block">
                Why Choose Us
              </span>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
                Core <span className="text-primary">Values</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                The principles that guide every hammer strike, every grind, and
                every finished blade we produce.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  id: "01",
                  title: "Precision",
                  desc: "We measure in microns. Every edge is honed to perfection using state-of-the-art laser technology combined with traditional sharpening methods.",
                  icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                },
                {
                  id: "02",
                  title: "Durability",
                  desc: "Built to withstand the harshest conditions on Earth. Our blades undergo rigorous stress testing to ensure they never fail when you need them most.",
                  icon: "M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.85.577-4.147l.056-.194c.31-.85.68-1.65 1.102-2.402.64-1.147 1.433-2.201 2.36-3.147L8 1.127",
                },
                {
                  id: "03",
                  title: "Heritage",
                  desc: "Honoring centuries of bladesmithing tradition. We respect the old ways while embracing the new, creating a legacy that lasts for generations.",
                  icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group relative bg-gray-900/50 backdrop-blur-sm p-10 rounded-2xl border border-gray-800 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                >
                  {/* Large Background Number */}
                  <div className="absolute -right-6 -bottom-10 text-9xl font-black text-gray-800/30 group-hover:text-primary/10 transition-colors duration-500 select-none">
                    {item.id}
                  </div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-gray-700 flex items-center justify-center mb-8 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_-5px_rgba(220,38,38,0.3)] transition-all duration-500">
                      <svg
                        className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors duration-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d={item.icon}
                        ></path>
                      </svg>
                    </div>

                    <h3 className="text-2xl font-black uppercase tracking-wide mb-4 text-white group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-8">
            Ready to Find Your <span className="text-primary">Edge?</span>
          </h2>
          <Link
            href="/shop"
            className="inline-block bg-white text-black hover:bg-primary hover:text-white px-10 py-4 font-bold uppercase tracking-widest transition-colors"
          >
            Shop Collection
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
