import '../src/index.css';

export const metadata = {
  title: 'RestroScans',
  description: 'See the restaurant menu. Make your order.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
