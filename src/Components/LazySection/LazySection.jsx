import React, { Suspense } from "react";

const LazySection = ({ children, fallback = null }) => {
  return <Suspense fallback={fallback}>{children}</Suspense>;
};

export default LazySection;