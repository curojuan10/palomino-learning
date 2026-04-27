// Landing pages use the root layout structure
// Just pass through to children

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
