import Link from 'next/link';
import Head from 'next/head';
import { SITE_TITLE } from '@/consts';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta name="description" content="Welcome to my website!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      
      <div className="home-container">
        <section className="hero-section">
          <h1>Welcome to Logbase Blog</h1>
          <p className="hero-description">
            This is a Next.js version of the Logbase Blog project. The UI has been migrated from Astro to Next.js while maintaining the same design and functionality.
          </p>
        </section>
        
        <section className="features-section">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>📡 RSS Feed Collection</h3>
              <p>Automatically collect and display RSS feeds from various sources</p>
            </div>
            <div className="feature-card">
              <h3>📧 Newsletter Subscription</h3>
              <p>Subscribe to our newsletter for the latest updates</p>
            </div>
            <div className="feature-card">
              <h3>📝 Contact Form</h3>
              <p>Get in touch with us through our contact form</p>
            </div>
            <div className="feature-card">
              <h3>📱 Responsive Design</h3>
              <p>Optimized for all devices and screen sizes</p>
            </div>
          </div>
        </section>
        
        <section className="pages-section">
          <h2>Pages</h2>
          <div className="pages-grid">
            <Link href="/blog" className="page-link">
              <h3>Blog</h3>
              <p>Read our latest articles and posts</p>
            </Link>
            <Link href="/about" className="page-link">
              <h3>About</h3>
              <p>Learn more about our project</p>
            </Link>
            <Link href="/rss-feed" className="page-link">
              <h3>RSS Feed</h3>
              <p>Browse collected RSS feeds</p>
            </Link>
            <Link href="/newsletter" className="page-link">
              <h3>Newsletter</h3>
              <p>Manage your newsletter subscription</p>
            </Link>
          </div>
        </section>
        
        <section className="status-section">
          <p className="status-message">
            The project is currently under development. More features will be added soon!
          </p>
        </section>
      </div>
    </>
  );
} 