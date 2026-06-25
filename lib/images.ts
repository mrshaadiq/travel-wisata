// Centralized Unsplash imagery for Aircare. Each entry is a curated, thematically
// appropriate travel photo. Widths/heights are tuned per usage to keep layout crisp.
const u = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`;

export const destinationImages = {
  bali: u("1537996194471-e657df975ab4"),
  rajaAmpat: u("1516026672322-bc52d61a55d5"),
  labuanBajo: u("1589394815804-964ed0be2eb5"),
  bromo: u("1589182373726-e4f658ab50f0"),
  borobudur: u("1596402184320-417e7178b2cd"),
  lombok: u("1573790387438-4da905039392"),
  yogyakarta: u("1584810359583-96fc9f6f00cc"),
  bandung: u("1599661046289-e31897846e41"),
  komodo: u("1518509562904-e7ef99cdcc86"),
};

export const heroImages = {
  dashboard: u("1469854523086-cc02fe5d8800", 1600, 500),
  login: u("1507525428034-b723cf961d3e", 1200, 1600),
  loginAlt: u("1505228395891-9a51e7e86bf6", 1200, 1600),
};

export const hotelImages = {
  ayana: u("1566073771259-6a8506099945"),
  mulia: u("1571896349842-33c89424de2d"),
  padma: u("1582719478250-c89cae4dc85b"),
  alila: u("1564501049412-61c2a3083791"),
  plataran: u("1551882547-ff40c63fe5fa"),
};

// Stable avatar set via DiceBear (no external photo licensing concerns).
export const avatar = (seed: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
