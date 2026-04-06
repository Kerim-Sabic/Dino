import { SiteMode } from "@prisma/client";
import type { InventoryPoolData, PriceTierData, PricingConfigData, PricingSnapshot } from "@/lib/types";

function getCurrentTier(tiers: PriceTierData[], soldCount: number) {
  const activeTiers = tiers.filter((tier) => tier.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  return (
    activeTiers.find((tier) => soldCount >= tier.startSoldCount && soldCount <= tier.endSoldCount) ||
    activeTiers[activeTiers.length - 1] ||
    null
  );
}

function getNextTier(tiers: PriceTierData[], soldCount: number) {
  return (
    tiers
      .filter((tier) => tier.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .find((tier) => tier.startSoldCount > soldCount) || null
  );
}

function deriveUrgencyLabel(availableCount: number, lowStockThreshold: number) {
  if (availableCount <= 0) {
    return "Kontingent je trenutno zatvoren.";
  }

  if (availableCount <= 5) {
    return "Ostalo je još vrlo malo komada iz trenutnog nivoa.";
  }

  if (availableCount <= lowStockThreshold) {
    return "Ulazimo u zadnji dio aktivnog kontingenta.";
  }

  if (availableCount <= 20) {
    return "Dio kontingenta je već potvrđen, ali rezervacije su još otvorene.";
  }

  return "Aktivna dostupnost je otvorena i rezervacije se obrađuju ručno.";
}

export function resolvePricingSnapshot({
  tiers,
  config,
  pool,
  siteMode,
}: {
  tiers: PriceTierData[];
  config: PricingConfigData;
  pool: InventoryPoolData;
  siteMode?: SiteMode;
}): PricingSnapshot {
  const availableCount = Math.max(pool.totalStock - pool.reservedCount - pool.soldCount, 0);
  const currentTier = getCurrentTier(tiers, pool.soldCount);
  const nextTier = getNextTier(tiers, pool.soldCount);

  let currentPrice = currentTier?.price ?? 0;
  let source: PricingSnapshot["source"] = "tier";
  let priceLabel = currentTier?.publicLabel || "Aktuelna cijena";

  if (config.promoOverrideEnabled && config.promoOverridePrice) {
    currentPrice = config.promoOverridePrice;
    source = "promo";
    priceLabel = config.promoOverrideLabel || "Privremena ponuda";
  } else if (config.manualOverrideEnabled && config.manualOverridePrice) {
    currentPrice = config.manualOverridePrice;
    source = "manual";
    priceLabel = config.manualOverrideLabel || "Ručna javna cijena";
  } else if (config.scarcityOverrideEnabled && config.scarcityOverridePrice) {
    currentPrice = config.scarcityOverridePrice;
    source = "scarcity";
    priceLabel = config.scarcityOverrideLabel || "Finalna hitna cijena";
  }

  const soldOut = siteMode === SiteMode.SOLD_OUT || !config.allowReservations || availableCount <= 0;

  return {
    currentPrice,
    currency: config.currency,
    currentTier,
    nextTier,
    source: soldOut ? "sold_out" : source,
    priceLabel: soldOut ? "Trenutno rasprodano" : priceLabel,
    priceMessage:
      !soldOut && config.publicPriceMessageOverride
        ? config.publicPriceMessageOverride
        : "Javna cijena vrijedi za trenutno otvoreni nivo i potvrđuje se ručno nakon pregleda zahtjeva.",
    nextPriceLabel:
      !soldOut && config.showNextPrice && nextTier
        ? `Sljedeći nivo ${nextTier.price} ${config.currency}`
        : null,
    urgencyLabel: config.publicUrgencyOverride || deriveUrgencyLabel(availableCount, pool.lowStockThreshold),
    availableCount,
    reservedCount: pool.reservedCount,
    soldCount: pool.soldCount,
    totalStock: pool.totalStock,
    allowReservations: !soldOut,
  };
}
