/* eslint-disable */
// Generates 16:10 landscape composite covers from individual activity photos.
// Panel order matches the package title so users see activities in the same order they read.
const sharp = require("sharp");
const path = require("path");

const MEDIA = path.join(__dirname, "..", "public", "media");
const W = 1600;
const H = 1000;

const positionFor = (file) => {
  const f = file.toLowerCase();
  if (f.includes("tancerz")) return "top";
  if (f.includes("fotograf")) return "top";
  if (f.includes("kregle")) return "top";
  if (f.includes("taniec")) return "top";
  if (f.includes("kolacja")) return "center";
  if (f.includes("dywan")) return "center";
  if (f.includes("gokarty")) return "center";
  if (f.includes("spa")) return "center";
  if (f.includes("klub")) return "center";
  if (f.includes("piknik")) return "center";
  if (f.includes("gondola")) return "center";
  if (f.includes("chrysler")) return "center";
  return "attention";
};

async function compose(parts, outName) {
  const n = parts.length;
  let tiles;
  if (n === 2) {
    const w1 = Math.floor(W / 2);
    tiles = [
      { file: parts[0], left: 0, top: 0, width: w1, height: H },
      { file: parts[1], left: w1, top: 0, width: W - w1, height: H },
    ];
  } else if (n === 3) {
    const col = Math.floor(W / 3);
    tiles = [
      { file: parts[0], left: 0, top: 0, width: col, height: H },
      { file: parts[1], left: col, top: 0, width: col, height: H },
      { file: parts[2], left: col * 2, top: 0, width: W - col * 2, height: H },
    ];
  } else if (n === 4) {
    const halfW = Math.floor(W / 2);
    const halfH = Math.floor(H / 2);
    tiles = [
      { file: parts[0], left: 0, top: 0, width: halfW, height: halfH },
      { file: parts[1], left: halfW, top: 0, width: W - halfW, height: halfH },
      { file: parts[2], left: 0, top: halfH, width: halfW, height: H - halfH },
      { file: parts[3], left: halfW, top: halfH, width: W - halfW, height: H - halfH },
    ];
  } else if (n === 5) {
    // 2 on top, 3 on bottom
    const halfH = Math.floor(H / 2);
    const topW = Math.floor(W / 2);
    const botCol = Math.floor(W / 3);
    tiles = [
      { file: parts[0], left: 0, top: 0, width: topW, height: halfH },
      { file: parts[1], left: topW, top: 0, width: W - topW, height: halfH },
      { file: parts[2], left: 0, top: halfH, width: botCol, height: H - halfH },
      { file: parts[3], left: botCol, top: halfH, width: botCol, height: H - halfH },
      { file: parts[4], left: botCol * 2, top: halfH, width: W - botCol * 2, height: H - halfH },
    ];
  } else if (n === 6) {
    // 2x3 grid
    const halfH = Math.floor(H / 2);
    const col = Math.floor(W / 3);
    tiles = [
      { file: parts[0], left: 0, top: 0, width: col, height: halfH },
      { file: parts[1], left: col, top: 0, width: col, height: halfH },
      { file: parts[2], left: col * 2, top: 0, width: W - col * 2, height: halfH },
      { file: parts[3], left: 0, top: halfH, width: col, height: H - halfH },
      { file: parts[4], left: col, top: halfH, width: col, height: H - halfH },
      { file: parts[5], left: col * 2, top: halfH, width: W - col * 2, height: H - halfH },
    ];
  } else {
    throw new Error("unsupported count: " + n);
  }

  const composites = [];
  for (const t of tiles) {
    const buf = await sharp(path.join(MEDIA, t.file))
      .resize(t.width, t.height, { fit: "cover", position: positionFor(t.file) })
      .toBuffer();
    composites.push({ input: buf, top: t.top, left: t.left });
  }

  const canvas = sharp({
    create: { width: W, height: H, channels: 3, background: { r: 12, g: 12, b: 16 } },
  });

  await canvas.composite(composites).jpeg({ quality: 85 }).toFile(path.join(MEDIA, outName));
  console.log("wrote", outName);
}

(async () => {
  const PHOTOG = "fotograf-1-cover.jpg";
  const PHOTOG_ALT = "fotograf-1-2.jpg"; // used as "video" tile
  const LIMO = "Chrysler 300C 140'_4.jpg";
  const DANCER = "tancerz-1-cover.jpg";
  const DANCER_VIP = "tancerz-2-cover.jpg"; // VIP Arrest series dancer
  const DANCE = "taniec-1-cover.jpg";
  const CLUB = "klub-1-cover.jpg";
  const LOZA = "klub-1-2.jpg"; // VIP lounge tile
  const ARREST = "aresztowanie-1-cover.jpg";
  const PICNIC = "piknik-1-cover.jpg";
  const GOKART = "gokarty-1-1.jpg";
  const SPA = "spa-1-cover.jpg";
  const BOWLING = "kregle-1-cover.jpg";
  const GONDOLA = "gondola1.jpg";
  const RESTAURANT = "kolacja-1-cover.jpg";
  const RED_CARPET = "dywan z limuzyna-1.jpg";

  const jobs = [
    // ---- VIP Arrest Show series ----
    // "VIP Arrest Show + Tancerz + Limuzyna + Wejście VIP do Klubu"
    { out: "vip-arrest-tancerz-limuzyna-klub.jpg", parts: [ARREST, DANCER_VIP, LIMO, CLUB] },
    // "VIP Arrest Show + Tancerz + Limuzyna"
    { out: "vip-arrest-tancerz-limuzyna.jpg", parts: [ARREST, DANCER_VIP, LIMO] },
    // "VIP Arrest Show + Tancerz + Limuzyna + Mini Sesja + Wejście VIP do Klubu + Loża"
    { out: "vip-arrest-tancerz-limuzyna-sesja-klub-loza.jpg", parts: [ARREST, DANCER_VIP, LIMO, PHOTOG, CLUB, LOZA] },
    // "Limuzyna + Mini Sesja + Wejście VIP do Klubu"
    { out: "limuzyna-sesja-klub-vip.jpg", parts: [LIMO, PHOTOG, CLUB] },
    // "Panieński VIP – Loża VIP w klubie + Limuzyna + Mini Sesja"
    { out: "panienski-vip-loza-limuzyna-sesja.jpg", parts: [LOZA, LIMO, PHOTOG] },
    // "Prywatny fotograf + Wejście VIP do Klubu"
    { out: "fotograf-klub-vip.jpg", parts: [PHOTOG, CLUB] },

    // ---- Previously-archived / new packages ----
    // "Pakiet Sexy Panieński – Limuzyna + Mini Sesja + Tancerz + Klub"
    { out: "pakiet-sexy-panienski.jpg", parts: [LIMO, PHOTOG, DANCER, CLUB] },
    // "Prywatny Fotograf + Piknik nad Wisłą"
    { out: "fotograf-piknik.jpg", parts: [PHOTOG, PICNIC] },
    // "Prywatny fotograf + Limuzyna"
    { out: "fotograf-limuzyna.jpg", parts: [PHOTOG, LIMO] },
    // "Prywatny fotograf + Tancerz w apartamencie"
    { out: "fotograf-tancerz-apartament.jpg", parts: [PHOTOG, DANCER] },
    // "Kręgle + Limuzyna + Mini sesja + Klub"
    { out: "kregle-limuzyna-klub.jpg", parts: [BOWLING, LIMO, PHOTOG, CLUB] },
    // "Loża w klubie + Limuzyna + Mini sesja"
    { out: "loza-limuzyna.jpg", parts: [CLUB, LIMO, PHOTOG] },
    // "Loża w klubie + Limuzyna + Tancerz + Mini sesja"
    { out: "loza-limuzyna-tancerz.jpg", parts: [CLUB, LIMO, DANCER, PHOTOG] },

    // ---- Previously portrait covers, now landscape with title-matching order ----
    // "Nauka tańca + Przejazd Limuzyną + Tancerz erotyczny + Klub"
    { out: "Nauka tanca + tancerz + Limuzyna + Klub 2.jpg", parts: [DANCE, LIMO, DANCER, CLUB] },
    // "Gokarty + Mini sesja + Objazd Limuzyną po Warszawie + Klub"
    { out: "gokarty + limuzyna + klub 2.jpg", parts: [GOKART, PHOTOG, LIMO, CLUB] },
    // "Limuzyna + Mini Sesja + Spa"
    { out: "limuzyna + spa.jpg", parts: [LIMO, PHOTOG, SPA] },
    // "Prywatny fotograf + Nauka tańca + Objazd po Warszawie limuzyną + Klub"
    { out: "nauka tanca + fotograf + limuzyna + klub.jpg", parts: [PHOTOG, DANCE, LIMO, CLUB] },
    // "Prywatny fotograf + Objazd po Warszawie limuzyną + Tancerz + Klub"
    { out: "Fotograf + Limuzyna + tancerz + Klub.jpg", parts: [PHOTOG, LIMO, DANCER, CLUB] },
    // "Piknik nad Wisłą + Prywatny fotograf + Rejs gondolą po Wiśle"
    { out: "pikinik + fotograf + gondola.jpg", parts: [PICNIC, PHOTOG, GONDOLA] },
    // "Limuzyna + Prywatny Fotograf + Piknik nad Wisłą"
    { out: "limuzyna + fotograf + piknik-1.jpg", parts: [LIMO, PHOTOG, PICNIC] },
    // "Objazd po klubach muzycznych"
    { out: "objazdpoklubach.jpg", parts: [LIMO, CLUB] },

    // ---- Pre-designed landscape covers, regenerated so tile order matches the title ----
    // "Limuzyna + Piknik + Mini Sesja + Czerwony Dywan + Klub"
    { out: "limuzyna-piknik-sesja-klub.jpg", parts: [LIMO, PICNIC, PHOTOG, RED_CARPET, CLUB] },
    // "Prywatny Fotograf + Limuzyna + Czerwony Dywan + Klub"
    { out: "fotograf-limuzyna-dywan-klub.jpg", parts: [PHOTOG, LIMO, RED_CARPET, CLUB] },
    // "Mini Sesja + Wideo + Limuzyna + Czerwony Dywan + Klub"
    { out: "sesja-wideo-limuzyna-dywan-klub.jpg", parts: [PHOTOG, PHOTOG_ALT, LIMO, RED_CARPET, CLUB] },
    // "Mini Sesja + Wideo + Limuzyna + Klub"
    { out: "sesja-wideo-limuzyna-klub.jpg", parts: [PHOTOG, PHOTOG_ALT, LIMO, CLUB] },
    // "Prywatny Fotograf + Restauracja + Limuzyna + Czerwony Dywan + Klub"
    { out: "fotograf-restauracja-limuzyna-klub.jpg", parts: [PHOTOG, RESTAURANT, LIMO, RED_CARPET, CLUB] },
    // "Restauracja + Mini Sesja + Tancerz + Limuzyna + Czerwony Dywan + Klub"
    { out: "restauracja-tancerz-limuzyna-klub.jpg", parts: [RESTAURANT, PHOTOG, DANCER, LIMO, RED_CARPET, CLUB] },
  ];

  for (const j of jobs) {
    await compose(j.parts, j.out);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
