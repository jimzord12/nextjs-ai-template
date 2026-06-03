import type React from "react";

const MockedImage = (
  props: React.ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean;
    priority?: boolean;
    placeholder?: string;
    blurDataURL?: string;
    sizes?: string;
  },
) => {
  const {
    alt = "",
    fill,
    priority,
    placeholder,
    blurDataURL,
    sizes,
    ...imgProps
  } = props;
  // biome-ignore lint/performance/noImgElement: Storybook mock intentionally renders a raw img element.
  return <img alt={alt} {...imgProps} />;
};

export default MockedImage;
