/* Play */
export const PlayIcon = ({ size = 24, className = "" }) => (
  <svg
    viewBox="-1 0 12 12"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.074,3650.7335 L12.308,3654.6315 C10.903,3655.5815 9,3654.5835 9,3652.8985 L9,3645.1015 C9,3643.4155 10.903,3642.4185 12.308,3643.3685 L18.074,3647.2665 C19.306,3648.0995 19.306,3649.9005 18.074,3650.7335" />
  </svg>
);

export const PauseIcon = ({ size = 24, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
);

export const FirstMoveIcon = ({ size = 24, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6.07001 22H5.94001C4.34001 22 4.01001 21.67 4.01001 20.07V3.94C4.01001 2.34 4.34001 2.01 5.94001 2.01H6.07001C7.67001 2.01 8.00001 2.34 8.00001 3.94V20.07C8.00001 21.67 7.67001 22 6.07001 22ZM19.93 21.13L19.86 21.2C18.73 22.33 18.26 22.33 17.13 21.2L10.73 14.83C9.00001 13.06 9.00001 10.93 10.73 9.16L17.13 2.79C18.26 1.66 18.73 1.66 19.86 2.79L19.93 2.86C21.06 3.99 21.06 4.46 19.93 5.59L13.56 11.99L19.93 18.39C21.06 19.52 21.06 19.99 19.93 21.12V21.13Z" />
  </svg>
);

export const PreviousMoveIcon = ({ size = 24, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16.27 21.13L16.2 21.2C15.07 22.33 14.6 22.33 13.47 21.2L7.06996 14.83C5.33996 13.06 5.33996 10.93 7.06996 9.16L13.47 2.79C14.6 1.66 15.07 1.66 16.2 2.79L16.27 2.86C17.4 3.99 17.4 4.46 16.27 5.59L9.89996 11.99L16.27 18.39C17.4 19.52 17.4 19.99 16.27 21.12V21.13Z" />
  </svg>
);

export const NextMoveIcon = ({ size = 24, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: "scaleX(-1)" }}
  >
    <path d="M16.27 21.13L16.2 21.2C15.07 22.33 14.6 22.33 13.47 21.2L7.06996 14.83C5.33996 13.06 5.33996 10.93 7.06996 9.16L13.47 2.79C14.6 1.66 15.07 1.66 16.2 2.79L16.27 2.86C17.4 3.99 17.4 4.46 16.27 5.59L9.89996 11.99L16.27 18.39C17.4 19.52 17.4 19.99 16.27 21.12V21.13Z" />
  </svg>
);

export const LastMoveIcon = ({ size = 24, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: "scaleX(-1)" }}
  >
    <path d="M6.07001 22H5.94001C4.34001 22 4.01001 21.67 4.01001 20.07V3.94C4.01001 2.34 4.34001 2.01 5.94001 2.01H6.07001C7.67001 2.01 8.00001 2.34 8.00001 3.94V20.07C8.00001 21.67 7.67001 22 6.07001 22ZM19.93 21.13L19.86 21.2C18.73 22.33 18.26 22.33 17.13 21.2L10.73 14.83C9.00001 13.06 9.00001 10.93 10.73 9.16L17.13 2.79C18.26 1.66 18.73 1.66 19.86 2.79L19.93 2.86C21.06 3.99 21.06 4.46 19.93 5.59L13.56 11.99L19.93 18.39C21.06 19.52 21.06 19.99 19.93 21.12V21.13Z" />
  </svg>
);
