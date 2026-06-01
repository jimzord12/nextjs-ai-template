import React from "react";

const MockedImage = (
  props: React.ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean;
    priority?: boolean;
    placeholder?: string;
    blurDataURL?: string;
    sizes?: string;
  },
) => {
  const { fill, priority, placeholder, blurDataURL, sizes, ...imgProps } = props;
  return <img {...imgProps} />;
};

export default MockedImage;
