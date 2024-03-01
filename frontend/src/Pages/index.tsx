export default function Page({ children, className }) {
  return <div className={`px-4 ${className}`}>{children}</div>;
}
