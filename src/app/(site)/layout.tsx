import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { MobileStickyCta } from "@/components/site/mobile-sticky-cta";
import {
  getInventoryPool,
  getPriceTiers,
  getPricingConfig,
  getSiteSettings,
} from "@/lib/public-data";
import { resolvePricingSnapshot } from "@/lib/pricing";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [settings, tiers, pricingConfig, inventoryPool] = await Promise.all([
    getSiteSettings(),
    getPriceTiers(),
    getPricingConfig(),
    getInventoryPool(),
  ]);
  const pricing = resolvePricingSnapshot({
    tiers,
    config: pricingConfig,
    pool: inventoryPool,
    siteMode: settings.siteMode,
  });

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {settings.announcementEnabled && settings.announcementText ? (
        <div className="border-b border-primary/14 bg-primary/[0.07] px-4 py-2.5 text-center text-[10.5px] font-semibold uppercase tracking-[0.18em] text-primary">
          {settings.announcementText}
        </div>
      ) : null}
      <SiteHeader settings={settings} />
      <main>{children}</main>
      <SiteFooter settings={settings} />
      <MobileStickyCta settings={settings} pricing={pricing} />
    </div>
  );
}
