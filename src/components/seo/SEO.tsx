import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({ 
  title = 'GALAXY ERP - Next-Gen Educational Institution Platform', 
  description = 'Transform your school with Galaxy ERP. Enterprise-grade management with AI-powered insights, automated attendance, and secure fee management.',
  keywords = 'ERP, School Management, Education AI, Galaxy ERP, School Software',
  image = '/og-image.png',
  url = 'https://galaxy-erp.com'
}) => {
  const siteTitle = title.includes('GALAXY') ? title : `${title} | GALAXY ERP`;

  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Standard Meta */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="theme-color" content="#4f46e5" />
      <link rel="canonical" href={url} />
    </Helmet>
  );
};
