import StateProvider from "./state-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <StateProvider>{children}</StateProvider>;
}
