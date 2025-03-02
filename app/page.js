import Link from 'next/link';
import Portfolio from './components/Portfolio';

export default function Home() {

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Showcase Your Work with Portfoli
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Create a professional portfolio that stands out and gets you noticed
          </p>
          <Link
            href="/portfolio/add"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Create Your Portfolio
          </Link>
        </div>
      </section>

      {/* Portfolio List Section */}
      <div className='mx-auto container py-16'>
        <Portfolio/>
      </div>

      {/* Call to Action Section */}
      <section className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Create Your Portfolio?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of professionals who trust Portfoli to showcase their work
          </p>
          <Link
            href="/create"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}
