import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'IdeaTesseract - Multi-Dimensional Business Architect',
  description = 'IdeaTesseract is an AI-powered business architect that generates infinitely detailed, step-by-step business plans, strategies, and structures for any concept or industry.',
  keywords = 'business plan generator, AI business architect, startup ideas, business strategy, entrepreneurship, business planning tool, IdeaTesseract, startup generator',
  ogImage = 'https://ideatesseract.com/og-image.jpg',
  ogType = 'website',
  canonical = 'https://ais-pre-qwdzgtvcxwikuaul7m6xio-226285742400.asia-southeast1.run.app/',
}) => {
  const siteTitle = title.includes('IdeaTesseract') ? title : `${title} | IdeaTesseract`;

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};
