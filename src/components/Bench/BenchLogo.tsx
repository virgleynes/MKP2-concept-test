import styles from "./Bench.module.css";

export default function BenchLogo() {
  return (
    <svg
      className={styles.logo}
      viewBox="540 400 480 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* B and E — slide left on hover */}
      <g className={styles.leftGroup}>
        <path
          d="M609 473.156H630.621C642.461 473.156 647.673 468.479 647.673 460.23V459.97C647.673 453.475 643.877 450.097 638.471 449.123C643.619 447.889 646.451 444.512 646.451 439.12V438.861C646.451 431.976 642.075 426.714 630.75 426.714H609V473.156ZM623.221 444.836V436.327H627.597C631.2 436.327 632.68 437.691 632.68 440.484V440.744C632.68 443.602 631.264 444.836 627.661 444.836H623.221ZM623.221 463.478V453.605H627.532C631.65 453.605 633.324 455.294 633.324 458.346V458.606C633.324 461.724 631.586 463.478 627.854 463.478H623.221Z"
          fill="currentColor"
        />
        <path
          d="M659.863 473.156H693.581V461.854H674.405V454.904H688.819V444.576H674.405V438.016H692.551V426.714H659.863V473.156Z"
          fill="currentColor"
        />
      </g>

      {/* N bench — decomposed into bar + two legs for animation */}
      <rect
        className={styles.bar}
        x="705.356"
        y="426.761"
        width="135.59"
        height="13.918"
        fill="currentColor"
      />
      <rect
        className={styles.leftLeg}
        x="705.356"
        y="439.679"
        width="16.087"
        height="33.477"
        fill="currentColor"
      />
      <rect
        className={styles.rightLeg}
        x="824.859"
        y="439.679"
        width="16.087"
        height="33.477"
        fill="currentColor"
      />

      {/* C and H — slide right on hover */}
      <g className={styles.rightGroup}>
        <path
          d="M874.769 474C886.931 474 895.811 467.57 896.583 455.359H882.04C881.525 460.035 878.565 462.179 874.447 462.179C868.784 462.179 865.696 457.892 865.696 450.162V449.643C865.696 441.783 868.913 437.627 874.19 437.627C878.244 437.627 880.496 440.03 880.946 444.317H896.004C894.91 431.716 886.544 426 874.125 426C860.548 426 850.317 435.353 850.317 449.708V450.227C850.317 464.452 858.167 474 874.769 474Z"
          fill="currentColor"
        />
        <path
          d="M908.273 473.156H922.88V455.294H936.393V473.156H951V426.714H936.393V443.862H922.88V426.714H908.273V473.156Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
