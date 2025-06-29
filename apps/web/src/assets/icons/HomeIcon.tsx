interface props {
  fill?: string;
  filled?: boolean;
  size?: string;
  height?: string;
  width?: string;
}

export const HomeIcon: React.FC<props> = ({
  fill,
  filled,
  size,
  height,
  width,
}) => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height={size || height || "24px"}
        viewBox="0 -960 960 960"
        width={size || width || "24px"}
        fill={filled ? fill : "#e3e3e3"}
      >
        <path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z" />
      </svg>
    </div>
  );
};
