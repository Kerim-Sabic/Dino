import { PublishStatus, SiteMode } from "@prisma/client";
import type {
  BlogPostData,
  FaqItemData,
  HomepageContentData,
  InventoryPoolData,
  LegalDocumentData,
  MeetupZoneData,
  PriceTierData,
  PricingConfigData,
  SiteSettingsData,
  TestimonialData,
  TrustBadgeData,
} from "@/lib/types";

export const defaultSiteSettings: SiteSettingsData = {
  siteMode: SiteMode.LIVE,
  siteName: "Dino Merlin Koševo ulaznice",
  businessLabel: "Privatna rezervacija fizičkih ulaznica",
  city: "Sarajevo",
  whatsappNumber: "+38761222333",
  phoneNumber: "+38761222333",
  instagramHandle: "@dino.kosevo.rezervacije",
  contactEmail: "info@dino-kosevo.ba",
  businessHours: "Svaki dan 09:00 - 22:00",
  responseTimeText: "Odgovaramo u pravilu u roku od 15 do 30 minuta tokom dana.",
  primaryMeetupText: "Preuzimanje isključivo uživo u Sarajevu, po dogovoru.",
  meetupGuidance:
    "Dogovor ide direktno porukom ili pozivom. Kupac vidi fizičku ulaznicu prije završetka kupovine i plaća tek prilikom preuzimanja.",
  announcementEnabled: true,
  announcementText:
    "Parter Zona 2 · fizičke ulaznice · lično preuzimanje u Sarajevu",
  heroTicketLabel: "Parter Zona 2",
  seoDefaultTitle:
    "Dino Merlin Koševo ulaznice | Privatna rezervacija fizičkih ulaznica u Sarajevu",
  seoDefaultDescription:
    "Privatna rezervacija fizičkih ulaznica za Dino Merlin na Koševu. Parter Zona 2, lično preuzimanje u Sarajevu, bez online plaćanja i bez digitalne dostave.",
  seoDefaultImage: "/opengraph-image",
  shortDisclaimer:
    "Nezavisna privatna rezervacija i preprodaja fizičkih ulaznica. Stranica nije službeni prodajni kanal niti je povezana s izvođačem, organizatorom, dvoranom ili službenim partnerima.",
  soldOutTitle: "Trenutno nema slobodnih ulaznica",
  soldOutDescription:
    "Kontingent je privremeno zatvoren. Ako želite ostati prvi u redu za oslobađanje rezervacija, ostavite kontakt i javit ćemo se ako se pojavi nova dostupnost.",
  waitlistTitle: "Uđite na listu čekanja",
  waitlistDescription:
    "Kada se oslobodi rezervacija ili stigne nova serija fizičkih ulaznica, prioritetno kontaktiramo osobe koje su ostavile ispravan broj telefona ili WhatsApp.",
  handoffCount: 86,
  fastResponseMinutes: 20,
};

export const defaultHomepageContent: HomepageContentData = {
  heroEyebrow: "Privatna rezervacija fizičkih ulaznica u Sarajevu",
  heroTitle:
    "Parter Zona 2 za Dino Merlin na Koševu. Zahtjev online, preuzimanje uživo u Sarajevu.",
  heroDescription:
    "Jedna kategorija, jasan proces i bez online plaćanja. Pošaljete zahtjev, dobijete direktan odgovor, a kupovinu završavate tek uživo nakon pregleda fizičke ulaznice.",
  heroPrimaryLabel: "Pošalji zahtjev",
  heroSecondaryLabel: "Provjeri dostupnost",
  heroTrustLine:
    "Fizičke ulaznice, Sarajevo preuzimanje i plaćanje tek prilikom sastanka.",
  scarcityTitle: "Zašto ozbiljni kupci reaguju na vrijeme",
  scarcityDescription:
    "Cijena ne raste dnevno, nego po nivou zatvorenog kontingenta. Kada se jedan nivo zatvori, sljedeća cijena se aktivira automatski.",
  whyReserveTitle: "Zašto ovaj model djeluje sigurnije od tipičnog oglasa",
  whyReserveIntro:
    "Kupac odmah vidi da je proces jasan, lokalno vezan i bez rizičnih online uplata. To spušta anksioznost i ubrzava odluku bez agresivnog prodajnog pritiska.",
  whyReserveItems: [
    "Aktuelna cijena i naredni nivo su jasno objašnjeni bez skrivenih koraka.",
    "Preuzimanje uživo u Sarajevu djeluje sigurnije od slanja novca unaprijed.",
    "Direktan WhatsApp ili poziv skraćuju put do potvrde i dogovora.",
    "Samo jedna kategorija znači manje zbunjenosti i bržu odluku.",
  ],
  processTitle: "Kako ide rezervacija",
  processIntro:
    "Sve je postavljeno tako da kupac za manje od minute shvati šta dobija, kako se potvrđuje i kada plaća.",
  trustTitle: "Zašto ovo djeluje ozbiljno i sigurno",
  trustIntro:
    "Fokus je na fizičkoj ulaznici, lokalnom sastanku, realnom odgovoru i jasnoj granici da ovo nije službeni prodajni kanal nego privatna rezervacija.",
  ticketsSectionTitle: "Jedna kategorija, predstavljena bez šuma i sumnje",
  ticketsSectionIntro:
    "Parter Zona 2 ima vlastitu stranicu sa cijenom, nivoom dostupnosti, objašnjenjem procesa i više kontaktnih ulaza za brzu konverziju.",
  ctaStripTitle: "Spremni za rezervaciju bez komplikacija?",
  ctaStripDescription:
    "Pošaljite zahtjev, dobijte potvrdu direktno i završite kupovinu tek uživo u Sarajevu.",
};

export const defaultTrustBadges: TrustBadgeData[] = [
  {
    label: "Fizičke ulaznice",
    detail: "Kupac vidi i preuzima papirnu ulaznicu uživo, bez digitalnog slanja.",
    sortOrder: 1,
    isActive: true,
  },
  {
    label: "Bez online plaćanja",
    detail: "Plaćanje ide tek na sastanku, nakon pregleda ulaznice.",
    sortOrder: 2,
    isActive: true,
  },
  {
    label: "Sarajevo preuzimanje",
    detail: "Lokalni susret ulijeva više povjerenja od daljinskih dogovora.",
    sortOrder: 3,
    isActive: true,
  },
  {
    label: "Direktan odgovor",
    detail: "WhatsApp, telefon ili Instagram bez posrednika i bez komplikovane online forme za naplatu.",
    sortOrder: 4,
    isActive: true,
  },
];

export const defaultTestimonials: TestimonialData[] = [
  {
    name: "Lejla H.",
    city: "Sarajevo",
    quote:
      "Najviše mi je značilo što nisam morala ništa plaćati unaprijed. Javili su se brzo, dogovorili lokaciju i sve je bilo potpuno jasno.",
    rating: 5,
    sortOrder: 1,
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Amar K.",
    city: "Ilidža",
    quote:
      "Kupio sam zato što je cijeli proces bio normalan i lokalno vezan. Nema muljanja, nema prebacivanja odgovornosti, samo direktan dogovor.",
    rating: 5,
    sortOrder: 2,
    isFeatured: true,
    isActive: true,
  },
  {
    name: "Nina S.",
    city: "Visoko",
    quote:
      "Sviđa mi se što je odmah bilo naglašeno da nije službeni kanal, nego privatna rezervacija. To mi je djelovalo iskrenije i sigurnije.",
    rating: 5,
    sortOrder: 3,
    isFeatured: false,
    isActive: true,
  },
];

export const defaultFaqItems: FaqItemData[] = [
  {
    question: "Da li je ovo službena prodaja ulaznica?",
    answer:
      "Ne. Ovo je nezavisna privatna rezervacija i preprodaja fizičkih ulaznica. Stranica nije službeni prodajni kanal i nije povezana s izvođačem, organizatorom, dvoranom ili Adriaticketom.",
    section: "Opće informacije",
    sortOrder: 1,
    isFeatured: true,
    isActive: true,
  },
  {
    question: "Da li plaćam online unaprijed?",
    answer:
      "Ne. Nema online naplate. Plaćanje se obavlja isključivo uživo u Sarajevu, nakon što pogledate fizičku ulaznicu i potvrdite dogovor.",
    section: "Plaćanje",
    sortOrder: 2,
    isFeatured: true,
    isActive: true,
  },
  {
    question: "Koja kategorija je dostupna?",
    answer:
      "Trenutno je u ponudi samo jedna kategorija: Parter Zona 2. Time je cijeli proces jednostavniji, pregledniji i brži za rezervaciju.",
    section: "Ulaznice",
    sortOrder: 3,
    isFeatured: true,
    isActive: true,
  },
  {
    question: "Kako znam po kojoj cijeni šaljem zahtjev?",
    answer:
      "Na stranici je prikazana aktuelna cijena za otvoreni inventarski nivo. Cijena se ne mijenja dnevno, nego kada se zatvori određeni broj ulaznica. Vaš zahtjev se bilježi s tadašnjom prikazanom cijenom.",
    section: "Cijene",
    sortOrder: 4,
    isFeatured: false,
    isActive: true,
  },
  {
    question: "Da li je rezervacija automatski potvrđena?",
    answer:
      "Ne. Online forma šalje zahtjev za rezervaciju. Potvrda dolazi tek nakon ručne provjere i direktnog kontakta s vama putem odabranog kanala.",
    section: "Rezervacija",
    sortOrder: 5,
    isFeatured: true,
    isActive: true,
  },
  {
    question: "Gdje se preuzimaju ulaznice?",
    answer:
      "Preuzimanje se dogovara isključivo u Sarajevu. Konkretna lokacija i vrijeme zavise od dostupnosti i dogovaraju se direktno nakon što pošaljete zahtjev.",
    section: "Preuzimanje",
    sortOrder: 6,
    isFeatured: false,
    isActive: true,
  },
  {
    question: "Možete li sačuvati cijenu dok dogovorimo sastanak?",
    answer:
      "Da, po procjeni i nakon direktne komunikacije može se zaključati obećana cijena za konkretan lead. To nije automatsko pravo, već operativna odluka nakon kontakta.",
    section: "Cijene",
    sortOrder: 7,
    isFeatured: false,
    isActive: true,
  },
  {
    question: "Šta ako je javno prikazano da je rasprodano?",
    answer:
      "I dalje se možete prijaviti na listu čekanja. Ako se neka rezervacija oslobodi ili se otvori dodatna količina, prioritetno kontaktiramo osobe koje su ostavile ispravan broj i željenu količinu.",
    section: "Dostupnost",
    sortOrder: 8,
    isFeatured: false,
    isActive: true,
  },
];

export const defaultMeetupZones: MeetupZoneData[] = [
  {
    id: "meetup-centar",
    name: "Centar Sarajeva",
    description: "Najpraktičniji izbor za većinu kupaca koji dolaze iz grada ili iz pravca Baščaršije.",
    sortOrder: 1,
    isPrimary: true,
    isActive: true,
  },
  {
    id: "meetup-marijin-dvor",
    name: "Marijin Dvor",
    description: "Pogodno za brzi susret uz jasan landmark i lak dolazak javnim prevozom.",
    sortOrder: 2,
    isPrimary: false,
    isActive: true,
  },
  {
    id: "meetup-ilidza",
    name: "Ilidža / zapadni ulaz u grad",
    description: "Praktično za kupce koji dolaze automobilom ili ulaze u Sarajevo iz tog pravca.",
    sortOrder: 3,
    isPrimary: false,
    isActive: true,
  },
];

export const defaultLegalDocuments: LegalDocumentData[] = [
  {
    slug: "uslovi-koristenja",
    title: "Uslovi korištenja",
    excerpt: "Pravila korištenja stranice i načina slanja zahtjeva za rezervaciju.",
    contentMarkdown: `# Uslovi korištenja

Ova stranica služi za **nezavisnu privatnu rezervaciju i preprodaju fizičkih ulaznica**. Korištenjem stranice prihvatate sljedeća pravila:

## 1. Priroda usluge

- Stranica nije službeni prodajni kanal.
- Stranica nije povezana s izvođačem, organizatorom, Koševom, Adriaticketom ili bilo kojim službenim partnerom.
- Online forma predstavlja **zahtjev za rezervaciju**, a ne automatsku potvrdu kupovine.

## 2. Potvrda rezervacije

- Svaki zahtjev se ručno pregledava.
- Potvrda dolazi tek nakon direktnog kontakta putem WhatsAppa, telefona ili Instagrama.
- Zadržavamo pravo da ne potvrdimo zahtjev ako zaliha više nije dostupna ili ako podaci nisu potpuni.

## 3. Način preuzimanja i plaćanja

- Ulaznice su fizičke.
- Preuzimanje se obavlja isključivo uživo u Sarajevu.
- Plaćanje se vrši tek prilikom ličnog sastanka i pregleda ulaznice.

## 4. Cijene

- Javna cijena zavisi od aktivnog inventarskog nivoa.
- Cijene se mogu mijenjati po zatvaranju određenog broja ulaznica ili po ručno aktiviranoj ponudi.
- Cijena vidljiva na stranici u trenutku vašeg zahtjeva može biti zabilježena uz vaš lead, ali konačna potvrda dolazi tek kroz direktnu komunikaciju.

## 5. Ograničenje odgovornosti

- Trudimo se da sve informacije budu tačne i ažurne.
- Ne odgovaramo za odluke donesene prije direktne potvrde rezervacije.
- Zadržavamo pravo izmjene sadržaja, cijena i dostupnosti bez prethodne najave.`,
  },
  {
    slug: "politika-privatnosti",
    title: "Politika privatnosti",
    excerpt: "Kako prikupljamo i koristimo vaše podatke kada pošaljete zahtjev za rezervaciju.",
    contentMarkdown: `# Politika privatnosti

Poštujemo privatnost korisnika i obrađujemo samo podatke koji su potrebni za vođenje rezervacije i komunikacije.

## 1. Koje podatke prikupljamo

- ime i prezime
- broj telefona i/ili WhatsApp
- Instagram kontakt ili e-mail, ako ih ostavite
- traženu količinu ulaznica
- željeni način kontakta
- podatke o dolasku na stranicu, kao što su referrer i UTM oznake

## 2. Zašto prikupljamo podatke

- da odgovorimo na vaš zahtjev
- da ručno potvrdimo dostupnost
- da organizujemo termin i lokaciju preuzimanja
- da poboljšamo rad stranice i razumijemo odakle dolazi saobraćaj

## 3. Kako čuvamo podatke

- Podaci se čuvaju u internom operativnom sistemu za vođenje leadova.
- Pristup imaju samo ovlaštene osobe uključene u obradu upita.
- Podaci se ne prodaju trećim stranama.

## 4. Vaša prava

- Možete tražiti ispravku netačnih podataka.
- Možete zatražiti brisanje svojih podataka nakon završetka komunikacije, osim ako ih moramo zadržati radi legitimnog poslovnog interesa ili evidencije.

## 5. Kontakt

Za pitanja o privatnosti javite se putem objavljenog kontakta na stranici Kontakt.`,
  },
  {
    slug: "odricanje-odgovornosti",
    title: "Odricanje od odgovornosti",
    excerpt: "Jasna granica između privatne rezervacije i bilo kakve službene prodaje.",
    contentMarkdown: `# Odricanje od odgovornosti

Ova stranica je kreirana isključivo za **nezavisnu privatnu rezervaciju i preprodaju fizičkih ulaznica**.

## Nismo službeni prodavač

- Nismo službeni prodajni partner.
- Nismo povezani s izvođačem Dino Merlin.
- Nismo povezani s organizatorom događaja.
- Nismo povezani s Adriaticketom niti drugim službenim partnerima.

## Šta stranica zaista radi

- prima zahtjeve zainteresovanih kupaca
- prikazuje informativnu javnu cijenu i nivo dostupnosti
- omogućava direktan kontakt i ručnu potvrdu
- završava transakciju isključivo uživo u Sarajevu

## Šta stranica ne radi

- ne vrši online naplatu
- ne isporučuje digitalne karte
- ne garantuje automatsku potvrdu samo na osnovu popunjene forme
- ne predstavlja zvaničnu prodajnu infrastrukturu događaja`,
  },
];

export const defaultBlogPosts: BlogPostData[] = [
  {
    slug: "dino-merlin-kosevo-parter-zona-2-sarajevo",
    title: "Dino Merlin Koševo Parter Zona 2: šta realno znači ova pozicija i zašto je tražena",
    excerpt:
      "Kratki lokalni vodič za ljude koji ciljaju Parter Zona 2 i žele razumjeti zašto se upravo ta kategorija najbrže zatvara.",
    contentMarkdown: `# Dino Merlin Koševo Parter Zona 2: šta realno znači ova pozicija i zašto je tražena

Kada ljudi traže **Dino Merlin Koševo Parter Zona 2**, obično ne traže samo naziv kategorije. Traže odgovor na tri pitanja: koliko je dobra pozicija, koliko brzo nestaje i da li je proces kupovine siguran.

## Zašto je Parter Zona 2 toliko tražen

- Za mnoge fanove ovo je balans između atmosfere, blizine i realne cijene.
- Ljudi koji dolaze zbog energije koncerta često ciljaju upravo parter jer žele puni doživljaj događaja.
- Kada je ponuda ograničena na fizičke ulaznice, ova kategorija se zatvara brže nego što kupci očekuju.

## Šta je važno kod privatne rezervacije

Privatna rezervacija ima smisla samo ako je proces kristalno jasan:

- znate da ne plaćate online
- znate da je riječ o fizičkoj ulaznici
- znate da se preuzimanje radi uživo u Sarajevu
- znate da online forma nije automatska kupovina nego zahtjev za potvrdu

Upravo zato kupci često biraju model ličnog preuzimanja. Pregled ulaznice uživo i direktna komunikacija spuštaju rizik i psihološku barijeru.

## Kako se kreće cijena

Najveća greška koju ljudi prave jeste čekanje uz pretpostavku da će cijena ostati ista cijelu sedmicu. U ovom modelu cijena ne raste po kalendaru, nego po nivou zatvorenog kontingenta. Kada se jedan nivo zatvori, ulazi se u naredni.

To znači da su najvažniji:

- trenutna dostupnost
- brzina odgovora
- jasna odluka da li vam upravo ova kategorija odgovara

## Zaključak

Ako tražite **fizičke ulaznice u Sarajevu** i ciljate baš Parter Zona 2, najvažnije je da reagujete dok je aktivni nivo još otvoren i da koristite kanal koji vam omogućava brz ručni odgovor.`,
    seoTitle:
      "Dino Merlin Koševo Parter Zona 2 | Vodič za Sarajevo rezervaciju fizičkih ulaznica",
    seoDescription:
      "Šta znači Parter Zona 2 za Dino Merlin na Koševu, zašto je ova kategorija tražena i kako funkcioniše privatna rezervacija fizičkih ulaznica u Sarajevu.",
    tags: ["dino merlin", "koševo", "parter zona 2", "sarajevo"],
    readTimeMinutes: 4,
    featured: true,
    status: PublishStatus.PUBLISHED,
    publishedAt: new Date("2026-04-05T08:00:00.000Z"),
  },
  {
    slug: "fizicke-ulaznice-sarajevo-kako-izgleda-sigurno-preuzimanje",
    title: "Fizičke ulaznice u Sarajevu: kako izgleda sigurno preuzimanje bez online plaćanja",
    excerpt:
      "Za kupce koji ne žele slati novac unaprijed, lokalni model preuzimanja uživo ima jasnu prednost. Evo kako izgleda proces koji ulijeva povjerenje.",
    contentMarkdown: `# Fizičke ulaznice u Sarajevu: kako izgleda sigurno preuzimanje bez online plaćanja

Sve više ljudi traži upravo izraz **fizičke ulaznice Sarajevo** jer žele izbjeći rizične dogovore na daljinu. Kada se rezervacija završi uživo, kupac dobija nekoliko ključnih sigurnosnih signala.

## Šta ljudima najviše znači

- da ne moraju uplaćivati novac unaprijed
- da vide ulaznicu prije završetka kupovine
- da komuniciraju s konkretnom osobom, a ne nejasnim profilom
- da je cijeli dogovor lokalno vezan za Sarajevo

## Kako izgleda dobar proces

1. Pošaljete kratak zahtjev s osnovnim podacima.  
2. Dobijete ručni odgovor putem WhatsAppa, poziva ili Instagrama.  
3. Potvrdi se dostupnost i, po potrebi, zaključava cijena za vaš lead.  
4. Dogovori se mjesto i vrijeme sastanka u Sarajevu.  
5. Ulaznica se pregleda uživo, a plaćanje ide tek tada.

## Zašto je to bitno

Kod mnogih kupaca najveća prepreka nije sama cijena, nego strah od prevare. Kada je proces transparentan, lokalno definisan i bez online naplate, stopa povjerenja raste mnogo brže.

## Kada reagovati

Ako je kontingent mali, najvažnije je ne čekati predugo. U modelu s cjenovnim nivoima naredna cijena dolazi tek kada se prethodni nivo rasproda, ali tada je već kasno za nižu cijenu.`,
    seoTitle:
      "Fizičke ulaznice Sarajevo | Sigurno preuzimanje bez online plaćanja",
    seoDescription:
      "Kako izgleda sigurno preuzimanje fizičkih ulaznica u Sarajevu bez online plaćanja i zašto lokalni model djeluje pouzdanije.",
    tags: ["fizičke ulaznice", "sarajevo", "preuzimanje ulaznica"],
    readTimeMinutes: 4,
    featured: true,
    status: PublishStatus.PUBLISHED,
    publishedAt: new Date("2026-04-04T08:00:00.000Z"),
  },
  {
    slug: "rezervacija-ulaznica-sarajevo-sta-kupci-zele-znati-prije-upita",
    title: "Rezervacija ulaznica Sarajevo: šta kupci žele znati prije nego pošalju upit",
    excerpt:
      "Prije slanja forme ljudi najčešće traže odgovore o cijeni, potvrdi, lokaciji preuzimanja i brzini odgovora. Ovdje su ti odgovori na jednom mjestu.",
    contentMarkdown: `# Rezervacija ulaznica Sarajevo: šta kupci žele znati prije nego pošalju upit

Ako neko traži **rezervacija ulaznica Sarajevo**, to obično znači da je već dovoljno zainteresovan, ali još ima nekoliko važnih mentalnih prepreka.

## Najčešća pitanja prije slanja zahtjeva

### Da li je cijena konačna?

Cijena na stranici je aktuelna za otvoreni nivo dostupnosti. Ako se taj nivo zatvori prije vaše potvrde, javna cijena može preći u naredni nivo. Zato ozbiljni kupci šalju zahtjev odmah dok je nivo još otvoren.

### Da li je rezervacija odmah potvrđena?

Ne. Forma šalje zahtjev, a potvrda dolazi tek nakon direktne ručne komunikacije. To je važno jer ovaj model nije automatizovana online kupovina.

### Gdje ide preuzimanje?

Isključivo u Sarajevu, po dogovoru. Lokalna predaja ulaznice stvara dodatno povjerenje i smanjuje nesigurnost oko kupovine.

### Zašto nema online plaćanja?

Zato što baš taj detalj mnogim kupcima djeluje sigurnije. Pregled fizičke ulaznice prije plaćanja uklanja najveći dio rizika koji ljudi vežu za dogovore o preprodaji.

## Šta treba pripremiti prije slanja forme

- ime i prezime
- broj za brzi odgovor
- željenu količinu
- preferirani kanal komunikacije
- eventualnu napomenu oko sastanka ili termina

Što je lead precizniji, to je potvrda brža i operativno jednostavnija.`,
    seoTitle:
      "Rezervacija ulaznica Sarajevo | Šta treba znati prije slanja upita",
    seoDescription:
      "Najvažnija pitanja prije slanja zahtjeva za rezervaciju ulaznica u Sarajevu: cijena, potvrda, preuzimanje i brzina odgovora.",
    tags: ["rezervacija ulaznica", "sarajevo", "dino merlin"],
    readTimeMinutes: 5,
    featured: false,
    status: PublishStatus.PUBLISHED,
    publishedAt: new Date("2026-04-03T08:00:00.000Z"),
  },
];

export const defaultPriceTiers: PriceTierData[] = [
  { name: "Prvih 5", sortOrder: 1, startSoldCount: 0, endSoldCount: 4, price: 90, publicLabel: "Otvaranje kontingenta", isActive: true },
  { name: "Narednih 10", sortOrder: 2, startSoldCount: 5, endSoldCount: 14, price: 109, publicLabel: "Rani nivo", isActive: true },
  { name: "Narednih 10", sortOrder: 3, startSoldCount: 15, endSoldCount: 24, price: 119, publicLabel: "Stabilna sredina", isActive: true },
  { name: "Narednih 10", sortOrder: 4, startSoldCount: 25, endSoldCount: 34, price: 129, publicLabel: "Pojačana potražnja", isActive: true },
  { name: "Narednih 10", sortOrder: 5, startSoldCount: 35, endSoldCount: 44, price: 139, publicLabel: "Kasni nivo", isActive: true },
  { name: "Zadnjih 5", sortOrder: 6, startSoldCount: 45, endSoldCount: 49, price: 149, publicLabel: "Finalni komadi", isActive: true },
];

export const defaultPricingConfig: PricingConfigData = {
  currency: "KM",
  manualOverrideEnabled: false,
  manualOverridePrice: null,
  manualOverrideLabel: "Ručna javna cijena",
  promoOverrideEnabled: false,
  promoOverridePrice: null,
  promoOverrideLabel: "Privremena ponuda",
  scarcityOverrideEnabled: false,
  scarcityOverridePrice: 159,
  scarcityOverrideLabel: "Finalna hitna cijena",
  showNextPrice: true,
  publicUrgencyOverride: null,
  publicPriceMessageOverride: null,
  allowReservations: true,
};

export const defaultInventoryPool: InventoryPoolData = {
  slug: "parter-zona-2",
  name: "Dino Merlin Koševo",
  categoryLabel: "Parter Zona 2",
  totalStock: 50,
  reservedCount: 0,
  soldCount: 0,
  isPublicVisible: true,
  publicDisplayMode: "RANGE",
  publicLabel: "Aktivna privatna dostupnost",
  lowStockThreshold: 12,
};
