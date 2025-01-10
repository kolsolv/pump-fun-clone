import React, { FC } from 'react';

interface Props extends React.SVGProps<SVGSVGElement> {
  children?: React.ReactNode;
}

const Icon24: FC<Props> = ({ children, ...restProps }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      {children}
    </svg>
  );
};

const Spinner: FC = () => {
  return (
    <Icon24>
      <path
        d="M10.5 1C5.13447 1.73159 1 6.33226 1 11.8986C1 17.9737 5.92487 22.8986 12 22.8986C17.5663 22.8986 22.167 18.7641 22.8986 13.3986H20.8756C20.1614 17.6552 16.4595 20.8986 12 20.8986C7.02944 20.8986 3 16.8691 3 11.8986C3 7.43909 6.24343 3.73714 10.5 3.02302V1Z"
        fill="url(#paint0_linear_27_50)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_27_50"
          x1="11.9493"
          y1="1"
          x2="11.9493"
          y2="22.8986"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00670C" />
          <stop offset="1" stopColor="#008F11" />
        </linearGradient>
      </defs>
    </Icon24>
  );
};

const Icons24 = {
  Spinner
};

export default Icons24;
