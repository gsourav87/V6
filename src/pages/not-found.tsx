import { Link } from "wouter";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-sm">

        {/* Large 404 */}
        <div className="text-8xl font-bold text-primary/20 leading-none select-none mb-4">
          ৪০৪
        </div>

        <h1 className="text-2xl font-bold text-foreground font-bengali mb-2">
          পেজটি পাওয়া যাচ্ছে না
        </h1>
        <p className="text-muted-foreground text-sm font-bengali mb-8 leading-relaxed">
          আপনি যে পেজটি খুঁজছেন সেটি সরানো হয়েছে বা অস্তিত্ব নেই।
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bengali font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
          >
            মূল ক্যালেন্ডারে যান
          </Link>
          <Link
            href="/today-bengali-date"
            className="inline-flex items-center justify-center gap-2 border border-border text-foreground font-bengali font-medium px-5 py-2.5 rounded-xl hover:bg-accent transition-colors text-sm"
          >
            আজকের তারিখ দেখুন
          </Link>
        </div>

      </div>
    </main>
  );
}
