import Script from 'next/script';
import React from 'react';

interface JsonLDSchemaProps {
  data: Record<string, any>;
}

const JsonLDSchema: React.FC<JsonLDSchemaProps> = ({ data }) => {
  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default JsonLDSchema;
