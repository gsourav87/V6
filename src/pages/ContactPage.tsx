import { StaticPageLayout } from "@/components/StaticPageLayout";
import { WHATSAPP_URL } from "@/components/WhatsAppCTA";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <StaticPageLayout
      path="/contact"
      crumb="যোগাযোগ"
      title="যোগাযোগ"
      description="সঠিক বাংলা ক্যালেন্ডার সম্পর্কে মতামত, ভুল-ত্রুটি সংশোধন বা যেকোনো প্রশ্নের জন্য আমাদের হোয়াটসঅ্যাপ চ্যানেলের মাধ্যমে যোগাযোগ করুন।"
    >
      <p>
        তারিখ বা পঞ্জিকায় কোনো ভুল চোখে পড়লে, কোনো পরামর্শ থাকলে, বা শুধু কিছু বলতে চাইলে — আমাদের
        হোয়াটসঅ্যাপ চ্যানেলের মাধ্যমে জানান।
      </p>

      <div className="not-prose py-2">
        <Button asChild size="lg" className="gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener">
            হোয়াটসঅ্যাপ চ্যানেলে যোগ দিন
          </a>
        </Button>
      </div>

      <h2>দ্রুত উত্তরের জন্য</h2>
      <p>
        তারিখ বা তথ্যগত ভুল রিপোর্ট করলে দ্রুত সংশোধনের চেষ্টা করা হয়। তবে এটি একটি ব্যক্তিগত উদ্যোগে
        পরিচালিত ওয়েবসাইট, তাই সব বার্তার সরাসরি উত্তর দেওয়া সবসময় সম্ভব নাও হতে পারে — ধন্যবাদান্তে
        ধৈর্যের জন্য।
      </p>
    </StaticPageLayout>
  );
}
