interface HeaderProps {
  onLoginClick?: () => void;
}

// Sign-in is temporarily hidden while the Google auth popup issue is sorted out.
// (Kept as a no-op so the existing call sites don't need to change.)
export function Header(_props: HeaderProps) {
  return null;
}
