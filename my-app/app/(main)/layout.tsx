import Navbar from "@/_components/_layout/Navbar";
import Footer from "@/_components/_layout/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
