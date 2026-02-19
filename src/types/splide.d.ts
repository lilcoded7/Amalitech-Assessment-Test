
import { ReactNode } from "react";

declare module "@splidejs/react-splide" {
  export interface SplideOptions {
    type?: string;
    perPage?: number;
    perMove?: number;
    autoplay?: boolean;
    interval?: number;
    speed?: number;
    gap?: string | number;
    arrows?: boolean;
    pagination?: boolean;
    pauseOnHover?: boolean;
    rewind?: boolean;
  }

  export interface SplideInstance {
    go: (control: string | number) => void;
  }

  export interface SplideProps {
    options?: SplideOptions;
    onMounted?: (splide: SplideInstance) => void;
    children?: ReactNode;
  }

  export const Splide: React.FC<SplideProps>;
  export const SplideSlide: React.FC<{ children?: ReactNode }>;
}
