export type Lang = "en" | "fr" | "de" | "ar";

const en = {
  nav: {
    gallery: "Gallery",
    gifts: "Gifts",
  },
  gallery: {
    title: "Gallery",
    subtitle: "A few moments from our day — thank you for being part of it.",
    close: "Close",
    previous: "Previous photo",
    next: "Next photo",
  },
  gifts: {
    title: "Gifts",
    text: "Your presence is the greatest gift of all. If you would like to contribute to our honeymoon, we are grateful for every gesture of love.",
    button: "Give a Gift",
    note: "via Revolut — no account required",
  },
};

const fr: typeof en = {
  nav: {
    gallery: "Galerie",
    gifts: "Cadeaux",
  },
  gallery: {
    title: "Galerie",
    subtitle: "Quelques moments de notre journée — merci d'en avoir fait partie.",
    close: "Fermer",
    previous: "Photo précédente",
    next: "Photo suivante",
  },
  gifts: {
    title: "Cadeaux",
    text: "Votre présence est le plus beau des cadeaux. Si vous souhaitez contribuer à notre voyage de noces, nous vous sommes reconnaissants pour chaque geste d'affection.",
    button: "Faire un Don",
    note: "via Revolut — sans compte requis",
  },
};

const de: typeof en = {
  nav: {
    gallery: "Galerie",
    gifts: "Geschenke",
  },
  gallery: {
    title: "Galerie",
    subtitle: "Ein paar Momente von unserem Tag — danke, dass ihr dabei wart.",
    close: "Schliessen",
    previous: "Vorheriges Foto",
    next: "Nächstes Foto",
  },
  gifts: {
    title: "Geschenke",
    text: "Eure Anwesenheit ist das grösste Geschenk. Wenn ihr zu unserer Hochzeitsreise beitragen möchtet, sind wir für jede Geste der Liebe dankbar.",
    button: "Ein Geschenk geben",
    note: "via Revolut — kein Konto erforderlich",
  },
};

const ar: typeof en = {
  nav: {
    gallery: "معرض الصور",
    gifts: "الهدايا",
  },
  gallery: {
    title: "معرض الصور",
    subtitle: "لحظات من يومنا — شكراً لكم على مشاركتنا إياه.",
    close: "إغلاق",
    previous: "الصورة السابقة",
    next: "الصورة التالية",
  },
  gifts: {
    title: "الهدايا",
    text: "وجودكم معنا هو أعظم هدية. إن أردتم المساهمة في شهر عسلنا، فنحن ممتنون لكل بادرة محبة.",
    button: "قدم هدية",
    note: "عبر Revolut — لا حاجة لحساب",
  },
};

export const translations = { en, fr, de, ar };
export type T = typeof en;
