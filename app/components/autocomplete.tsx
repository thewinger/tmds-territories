"use client";

import {
  useState,
  useMemo,
  ChangeEvent,
  MouseEvent,
  useRef,
  useEffect,
} from "react";

// Define a type for Office entries.
interface Office {
  territoryCodes: string[];
  id: string;
  updated: number;
  name: string;
  url: string;
  documentCount: number;
}

// Territory mapping (extend as needed).
const territoryNames: Record<string, string> = {
  AL: "Albania",
  AP: "Aripo",
  AR: "Argentina",
  AT: "Austria",
  AU: "Australia",
  BA: "Bosnia and Herzegovina",
  BG: "Bulgaria",
  BR: "Brazil",
  BX: "Benelux (Belgium, Luxemburg, Netherlands)",
  BZ: "Belize",
  CA: "Canada",
  CH: "Switzerland",
  CL: "Chile",
  CN: "China",
  CO: "Colombia",
  CR: "Costa Rica",
  CU: "Cuba",
  CY: "Cyprus",
  CZ: "Czech Republic",
  DE: "Germany",
  DK: "Denmark",
  DO: "Dominican Republic",
  EE: "Estonia",
  EG: "Egypt",
  ES: "Spain",
  FI: "Finland",
  FR: "France",
  GB: "United Kingdom",
  GE: "Georgia",
  GR: "Greece",
  HR: "Croatia",
  HU: "Hungary",
  IE: "Ireland",
  IL: "Israel",
  IN: "India",
  IS: "Iceland",
  IT: "Italy",
  JO: "Jordan",
  JP: "Japan",
  KH: "Cambodia",
  KR: "Republic of Korea",
  LA: "Lao PDR",
  LI: "Liechtenstein",
  LT: "Lithuania",
  LV: "Latvia",
  MA: "Morocco",
  MC: "Monaco",
  MD: "Moldova",
  ME: "Montenegro",
  MK: "North Macedonia",
  MT: "Malta",
  MX: "Mexico",
  MY: "Malaysia",
  NO: "Norway",
  NZ: "New Zealand",
  OA: "OAPI Region",
  PE: "Peru",
  PH: "Philippines",
  PL: "Poland",
  PT: "Portugal",
  RO: "Romania",
  RS: "Serbia",
  RU: "Russian Federation",
  SE: "Sweden",
  SI: "Slovenia",
  SK: "Slovakia",
  SM: "San Marino",
  TH: "Thailand",
  TN: "Tunisia",
  TR: "Türkiye",
  TT: "Trinidad and Tobago",
  UG: "Uganda",
  US: "United States",
  UY: "Uruguay",
  VN: "Viet Nam",
  ZM: "Zambia",
  WO: "WIPO",
};

// Full simplified dataset with all offices.
const offices: Office[] = [
  {
    territoryCodes: ["AL", "NEU", "EUR"],
    id: "AL",
    updated: 1742438251869,
    name: "Albania - GDIP",
    url: "http://dppi.gov.al/",
    documentCount: 26337,
  },
  {
    territoryCodes: [
      "AP",
      "BW",
      "GM",
      "GH",
      "KE",
      "LS",
      "LR",
      "MW",
      "MZ",
      "NA",
      "RW",
      "ST",
      "SL",
      "SO",
      "SD",
      "SZ",
      "TZ",
      "UG",
      "ZM",
      "ZW",
      "AFR",
    ],
    id: "AP",
    updated: 1742264545198,
    name: "ARIPO - ARIPO",
    url: "http://www.aripo.org",
    documentCount: 7044,
  },
  {
    territoryCodes: ["AR", "AMC"],
    id: "AR",
    updated: 1742438250463,
    name: "Argentina - INPI",
    url: "http://www.inpi.gob.ar",
    documentCount: 3396301,
  },
  {
    territoryCodes: ["AT", "EU", "EUR"],
    id: "AT",
    updated: 1742438250138,
    name: "Austria - OPA",
    url: "http://www.patentamt.at/",
    documentCount: 236420,
  },
  {
    territoryCodes: ["AU", "AUS"],
    id: "AU",
    updated: 1742438251383,
    name: "Australia - IPA",
    url: "https://www.ipaustralia.gov.au/",
    documentCount: 2307365,
  },
  {
    territoryCodes: ["BA", "NEU", "EUR"],
    id: "BA",
    updated: 1742438252713,
    name: "Bosnia and Herzegovina - IIP-BIH",
    url: "http://www.ipr.gov.ba/en/",
    documentCount: 29963,
  },
  {
    territoryCodes: ["BG", "EU", "EUR"],
    id: "BG",
    updated: 1742277617338,
    name: "Bulgaria - BPO",
    url: "http://www.bpo.bg/",
    documentCount: 169849,
  },
  {
    territoryCodes: ["BN", "ASI"],
    id: "BN",
    updated: 1731463300707,
    name: "Brunei Darussalam - BruIPO",
    url: "http://www.bruipo.gov.bn/",
    documentCount: 63609,
  },
  {
    territoryCodes: ["BR", "AMC"],
    id: "BR",
    updated: 1742438252682,
    name: "Brazil - INPI",
    url: "http://www.inpi.gov.br",
    documentCount: 5037708,
  },
  {
    territoryCodes: ["BE", "BX", "LU", "NL", "EU", "EUR"],
    id: "BX",
    updated: 1742438250088,
    name: "Benelux - BOIP",
    url: "https://www.boip.int/en",
    documentCount: 341208,
  },
  {
    territoryCodes: ["BZ", "AMC"],
    id: "BZ",
    updated: 1711165234499,
    name: "Belize - BELIPO",
    url: "https://www.belipo.bz",
    documentCount: 20017,
  },
  {
    territoryCodes: ["CA", "AMC"],
    id: "CA",
    updated: 1742438252870,
    name: "Canada - CIPO",
    url: "http://www.cipo.ic.gc.ca/eic/site/cipointernet-internetopic.nsf/eng/home",
    documentCount: 2068299,
  },
  {
    territoryCodes: ["CH", "NEU", "EUR"],
    id: "CH",
    updated: 1730946498480,
    name: "Switzerland - IGE-IPI",
    url: "https://www.ige.ch/en.html",
    documentCount: 510257,
  },
  {
    territoryCodes: ["CL", "AMC"],
    id: "CL",
    updated: 1742264545595,
    name: "Chile - INAPI",
    url: "http://www.inapi.cl",
    documentCount: 882273,
  },
  {
    territoryCodes: ["CN", "ASI"],
    id: "CN",
    updated: 1740687224263,
    name: "China - CNIPA",
    url: "https://english.cnipa.gov.cn/",
    documentCount: 53729473,
  },
  {
    territoryCodes: ["CO", "AMC"],
    id: "CO",
    updated: 1742438253335,
    name: "Colombia - SIC",
    url: "http://www.sic.gov.co",
    documentCount: 885556,
  },
  {
    territoryCodes: ["CR", "AMC"],
    id: "CR",
    updated: 1742438252237,
    name: "Costa Rica - RNPCR",
    url: "http://www.rnpdigital.com/",
    documentCount: 397364,
  },
  {
    territoryCodes: ["CU", "AMC"],
    id: "CU",
    updated: 1742438250996,
    name: "Cuba - OCPI",
    url: "http://www.ocpi.cu",
    documentCount: 58131,
  },
  {
    territoryCodes: ["CY", "EU", "EUR"],
    id: "CY",
    updated: 1741845836790,
    name: "Cyprus - DRCIP",
    url: "https://www.intellectualproperty.gov.cy/en/",
    documentCount: 94306,
  },
  {
    territoryCodes: ["CZ", "EU", "EUR"],
    id: "CZ",
    updated: 1742450419739,
    name: "Czech Republic - IPOCZ",
    url: "http://www.upv.cz",
    documentCount: 297398,
  },
  {
    territoryCodes: ["DE", "EU", "EUR"],
    id: "DE",
    updated: 1742438250965,
    name: "Germany - DPMA",
    url: "http://www.dpma.de",
    documentCount: 2531341,
  },
  {
    territoryCodes: ["DK", "EU", "EUR"],
    id: "DK",
    updated: 1742438252115,
    name: "Denmark - DKPTO",
    url: "http://www.dkpto.dk",
    documentCount: 305702,
  },
  {
    territoryCodes: ["DO", "AMC"],
    id: "DO",
    updated: 1742438250184,
    name: "Dominican Republic - ONAPI",
    url: "http://onapi.gob.do/",
    documentCount: 305704,
  },
  {
    territoryCodes: ["EE", "EU", "EUR"],
    id: "EE",
    updated: 1742450419551,
    name: "Estonia - EPA",
    url: "http://www.epa.ee",
    documentCount: 67787,
  },
  {
    territoryCodes: ["EG", "AFR"],
    id: "EG",
    updated: 1741401261146,
    name: "Egypt - ITDA",
    url: "http://www.itda.gov.eg",
    documentCount: 204089,
  },
  {
    territoryCodes: ["ES", "EU", "EUR"],
    id: "ES",
    updated: 1742438251830,
    name: "Spain - OEPM",
    url: "http://www.oepm.es ",
    documentCount: 1025283,
  },
  {
    territoryCodes: ["FI", "EU", "EUR"],
    id: "FI",
    updated: 1742438251688,
    name: "Finland - PRH",
    url: "https://www.prh.fi/en/index.html",
    documentCount: 202863,
  },
  {
    territoryCodes: ["FR", "EU", "EUR"],
    id: "FR",
    updated: 1742438253181,
    name: "France - INPI",
    url: "http://www.inpi.fr",
    documentCount: 3352640,
  },
  {
    territoryCodes: ["GB", "NEU", "EUR"],
    id: "GB",
    updated: 1742438251648,
    name: "United Kingdom - UKIPO",
    url: "http://www.ipo.gov.uk/",
    documentCount: 3416618,
  },
  {
    territoryCodes: ["GE", "NEU", "EUR"],
    id: "GE",
    updated: 1742438251979,
    name: "Georgia - NIPCG",
    url: "http://www.sakpatenti.gov.ge/en/",
    documentCount: 54419,
  },
  {
    territoryCodes: ["GR", "EU", "EUR"],
    id: "GR",
    updated: 1742450420190,
    name: "Greece - OBI",
    url: "http://www.obi.gr/",
    documentCount: 298756,
  },
  {
    territoryCodes: ["HR", "EU", "EUR"],
    id: "HR",
    updated: 1741932029663,
    name: "Croatia - DZIV",
    url: "http://www.dziv.hr/",
    documentCount: 57541,
  },
  {
    territoryCodes: ["HU", "EU", "EUR"],
    id: "HU",
    updated: 1742450420355,
    name: "Hungary - HIPO",
    url: "http://www.sztnh.gov.hu",
    documentCount: 151494,
  },
  {
    territoryCodes: ["IE", "EU", "EUR"],
    id: "IE",
    updated: 1742438253252,
    name: "Ireland - IPOI",
    url: "https://www.ipoi.gov.ie",
    documentCount: 185032,
  },
  {
    territoryCodes: ["IL", "ASI"],
    id: "IL",
    updated: 1742350579916,
    name: "Israel - ILPO",
    url: "http://www.trademarks.justice.gov.il",
    documentCount: 347838,
  },
  {
    territoryCodes: ["IN", "ASI"],
    id: "IN",
    updated: 1678413391245,
    name: "India - CGDPTM",
    url: "https://ipindia.gov.in",
    documentCount: 2415053,
  },
  {
    territoryCodes: ["IS", "NEU", "EUR"],
    id: "IS",
    updated: 1742438250597,
    name: "Iceland - ISIPO",
    url: "https://www.hugverk.is/en",
    documentCount: 63293,
  },
  {
    territoryCodes: ["IT", "EU", "EUR"],
    id: "IT",
    updated: 1742450420139,
    name: "Italy - UIBM",
    url: "https://uibm.mise.gov.it/index.php/it/",
    documentCount: 1206419,
  },
  {
    territoryCodes: ["JO", "ASI"],
    id: "JO",
    updated: 1656728648460,
    name: "Jordan - IPPD",
    url: "http://www.mit.gov.jo",
    documentCount: 168017,
  },
  {
    territoryCodes: ["JP", "ASI"],
    id: "JP",
    updated: 1742007601604,
    name: "Japan - JPO",
    url: "http://www.jpo.go.jp",
    documentCount: 5760942,
  },
  {
    territoryCodes: ["KH", "ASI"],
    id: "KH",
    updated: 1740536129223,
    name: "Cambodia - DIP",
    url: "http://www.cambodiaip.gov.kh",
    documentCount: 137440,
  },
  {
    territoryCodes: ["KR", "ASI"],
    id: "KR",
    updated: 1742438249858,
    name: "Republic of Korea - KIPO",
    url: "https://www.kipo.go.kr/en/MainApp",
    documentCount: 4880490,
  },
  {
    territoryCodes: ["LA", "ASI"],
    id: "LA",
    updated: 1742438252146,
    name: "Lao PDR - DIP",
    url: "https://dip.gov.la/?lang=en",
    documentCount: 51446,
  },
  {
    territoryCodes: ["LI", "NEU", "EUR"],
    id: "LI",
    updated: 1742438253208,
    name: "Liechtenstein - AVW-LLV",
    url: "http://www.llv.li/#/12481/amt-fur-volkswirtschaft",
    documentCount: 8504,
  },
  {
    territoryCodes: ["LT", "EU", "EUR"],
    id: "LT",
    updated: 1742450420002,
    name: "Lithuania - VPB",
    url: "http://www.vpb.gov.lt",
    documentCount: 96867,
  },
  {
    territoryCodes: ["LV", "EU", "EUR"],
    id: "LV",
    updated: 1742450420036,
    name: "Latvia - LRPV",
    url: "http://www.lrpv.gov.lv ",
    documentCount: 70944,
  },
  {
    territoryCodes: ["MA", "AFR"],
    id: "MA",
    updated: 1742264544367,
    name: "Morocco - OMPIC",
    url: "http://www.ompic.org.ma/",
    documentCount: 277556,
  },
  {
    territoryCodes: ["MC", "NEU", "EUR"],
    id: "MC",
    updated: 1742350579379,
    name: "Monaco - MCIPO",
    url: "https://mcipo.gouv.mc",
    documentCount: 19980,
  },
  {
    territoryCodes: ["MD", "NEU", "EUR"],
    id: "MD",
    updated: 1742438250628,
    name: "Moldova - AGEPI",
    url: "http://agepi.gov.md",
    documentCount: 55032,
  },
  {
    territoryCodes: ["ME", "NEU", "EUR"],
    id: "ME",
    updated: 1741141907946,
    name: "Montenegro - MEM",
    url: "https://www.gov.me/mek/is",
    documentCount: 18426,
  },
  {
    territoryCodes: ["MK", "NEU", "EUR"],
    id: "MK",
    updated: 1742438249486,
    name: "North Macedonia - SOIP",
    url: "http://www.ippo.gov.mk/EN/Index_en.aspx",
    documentCount: 41547,
  },
  {
    territoryCodes: ["MT", "EU", "EUR"],
    id: "MT",
    updated: 1742450419674,
    name: "Malta - CD-IPRD",
    url: "http://commerce.gov.mt",
    documentCount: 67453,
  },
  {
    territoryCodes: ["MX", "AMC"],
    id: "MX",
    updated: 1742438249449,
    name: "Mexico - IMPI",
    url: "https://www.gob.mx/impi",
    documentCount: 2574735,
  },
  {
    territoryCodes: ["MY", "ASI"],
    id: "MY",
    updated: 1548816499907,
    name: "Malaysia - MyIPO",
    url: "http://www.myipo.gov.my",
    documentCount: 819386,
  },
  {
    territoryCodes: ["NO", "NEU", "EUR"],
    id: "NO",
    updated: 1742438249530,
    name: "Norway - NIPO",
    url: "http://www.patentstyret.no/en/",
    documentCount: 314246,
  },
  {
    territoryCodes: ["NZ", "AUS"],
    id: "NZ",
    updated: 1742438250789,
    name: "New Zealand - IPONZ",
    url: "http://www.iponz.govt.nz",
    documentCount: 826484,
  },
  {
    territoryCodes: [
      "BJ",
      "BF",
      "CM",
      "CF",
      "TD",
      "KM",
      "CG",
      "CI",
      "GQ",
      "GA",
      "GN",
      "GW",
      "ML",
      "MR",
      "NE",
      "OA",
      "SN",
      "TG",
      "AFR",
    ],
    id: "OA",
    updated: 1742438250511,
    name: "OAPI - OAPI",
    url: "http://www.oapi.int",
    documentCount: 48179,
  },
  {
    territoryCodes: ["PE", "AMC"],
    id: "PE",
    updated: 1742438249966,
    name: "Peru - INDECOPI",
    url: "http://www.indecopi.gob.pe",
    documentCount: 694172,
  },
  {
    territoryCodes: ["PH", "ASI"],
    id: "PH",
    updated: 1742438252940,
    name: "Philippines - IPOPHL",
    url: "http://www.ipophil.gov.ph",
    documentCount: 699583,
  },
  {
    territoryCodes: ["PL", "EU", "EUR"],
    id: "PL",
    updated: 1742450420249,
    name: "Poland - PPO",
    url: "http://www.uprp.gov.pl ",
    documentCount: 516451,
  },
  {
    territoryCodes: ["PT", "EU", "EUR"],
    id: "PT",
    updated: 1742450419628,
    name: "Portugal - INPIPT",
    url: "https://inpi.justica.gov.pt/",
    documentCount: 607175,
  },
  {
    territoryCodes: ["RO", "EU", "EUR"],
    id: "RO",
    updated: 1742450420398,
    name: "Romania - OSIM",
    url: "http://www.osim.ro/",
    documentCount: 282332,
  },
  {
    territoryCodes: ["RS", "NEU", "EUR"],
    id: "RS",
    updated: 1742438250661,
    name: "Serbia - IPORS",
    url: "http://www.zis.gov.rs/pocetna.1.html ",
    documentCount: 68231,
  },
  {
    territoryCodes: ["RU", "NEU", "EUR"],
    id: "RU",
    updated: 1645660800000,
    name: "Russian Federation - ROSPATENT",
    url: "https://rospatent.gov.ru/en",
    documentCount: 791931,
  },
  {
    territoryCodes: ["SE", "EU", "EUR"],
    id: "SE",
    updated: 1742438252293,
    name: "Sweden - PRV",
    url: "http://www.prv.se/ ",
    documentCount: 509376,
  },
  {
    territoryCodes: ["SI", "EU", "EUR"],
    id: "SI",
    updated: 1742438251911,
    name: "Slovenia - SIPO",
    url: "http://www.uil-sipo.si/",
    documentCount: 57317,
  },
  {
    territoryCodes: ["SK", "EU", "EUR"],
    id: "SK",
    updated: 1742438252181,
    name: "Slovakia - SKIPO",
    url: "https://www.indprop.gov.sk",
    documentCount: 138487,
  },
  {
    territoryCodes: ["SM", "NEU", "EUR"],
    id: "SM",
    updated: 1742438252344,
    name: "San Marino - USBM",
    url: "http://www.usbm.sm/on-line/en/home.html",
    documentCount: 4524,
  },
  {
    territoryCodes: ["TH", "ASI"],
    id: "TH",
    updated: 1659404775188,
    name: "Thailand - DIP",
    url: "http://www.ipthailand.go.th/",
    documentCount: 1051842,
  },
  {
    territoryCodes: ["TN", "AFR"],
    id: "TN",
    updated: 1646483670404,
    name: "Tunisia - INNORPI",
    url: "http://www.innorpi.tn",
    documentCount: 94210,
  },
  {
    territoryCodes: ["TR", "ASI"],
    id: "TR",
    updated: 1742438253552,
    name: "Türkiye - TURKPATENT",
    url: "https://www.turkpatent.gov.tr/en",
    documentCount: 2576870,
  },
  {
    territoryCodes: ["TT", "AMC"],
    id: "TT",
    updated: 1742438250694,
    name: "Trinidad and Tobago - TTIPO",
    url: "https://ipo.gov.tt/",
    documentCount: 56010,
  },
  {
    territoryCodes: ["UG", "AFR"],
    id: "UG",
    updated: 1742438250006,
    name: "Uganda - URSB",
    url: "https://ursb.go.ug/",
    documentCount: 79077,
  },
  {
    territoryCodes: ["US", "AMC"],
    id: "US",
    updated: 1742350578391,
    name: "United States - USPTO",
    url: "http://www.uspto.gov/",
    documentCount: 12870747,
  },
  {
    territoryCodes: ["UY", "AMC"],
    id: "UY",
    updated: 1742438250566,
    name: "Uruguay - MIEM-DNPI",
    url: "http://www.miem.gub.uy/marcas-y-patentes",
    documentCount: 401322,
  },
  {
    territoryCodes: ["VN", "ASI"],
    id: "VN",
    updated: 1742438252070,
    name: "Viet Nam - IP-VIETNAM",
    url: "https://ipvietnam.gov.vn/en/web/english/home",
    documentCount: 824814,
  },
  {
    territoryCodes: ["ZM", "AFR"],
    id: "ZM",
    updated: 1742438251944,
    name: "Zambia - PACRA",
    url: "https://www.pacra.org.zm/",
    documentCount: 66759,
  },
  {
    territoryCodes: [
      "AT",
      "BE",
      "BX",
      "BG",
      "HR",
      "CY",
      "CZ",
      "DK",
      "EM",
      "EE",
      "FI",
      "FR",
      "DE",
      "GR",
      "HU",
      "IE",
      "IT",
      "LV",
      "LT",
      "LU",
      "MT",
      "NL",
      "PL",
      "PT",
      "RO",
      "SK",
      "SI",
      "ES",
      "SE",
      "EU",
      "EUR",
    ],
    id: "EM",
    updated: 1742450419969,
    name: "EUIPO - EUIPO",
    url: "https://euipo.europa.eu/",
    documentCount: 2526876,
  },
  {
    territoryCodes: [
      "AP",
      "AF",
      "AX",
      "AL",
      "DZ",
      "AS",
      "AD",
      "AO",
      "AI",
      "AQ",
      "AG",
      "AR",
      "AM",
      "AW",
      "AU",
      "AT",
      "AZ",
      "BS",
      "BH",
      "BD",
      "BB",
      "BY",
      "BE",
      "BZ",
      "BX",
      "BJ",
      "BM",
      "BT",
      "BO",
      "BQ",
      "BA",
      "BW",
      "BV",
      "BR",
      "IO",
      "BN",
      "BG",
      "BF",
      "BI",
      "KH",
      "CM",
      "CA",
      "CV",
      "KY",
      "CF",
      "TD",
      "CL",
      "CN",
      "CX",
      "CC",
      "CO",
      "KM",
      "CG",
      "CK",
      "CR",
      "HR",
      "CU",
      "CW",
      "CY",
      "CZ",
      "CI",
      "CD",
      "DK",
      "DJ",
      "DM",
      "DO",
      "EM",
      "EC",
      "EG",
      "SV",
      "GQ",
      "ER",
      "EE",
      "ET",
      "FK",
      "FO",
      "FJ",
      "FI",
      "FR",
      "GF",
      "PF",
      "TF",
      "GA",
      "GM",
      "GE",
      "DE",
      "GH",
      "GI",
      "GR",
      "GL",
      "GD",
      "GP",
      "GU",
      "GT",
      "GG",
      "GN",
      "GW",
      "GY",
      "HT",
      "HM",
      "HN",
      "HK",
      "HU",
      "IS",
      "IN",
      "ID",
      "IR",
      "IQ",
      "IE",
      "IM",
      "IL",
      "IT",
      "JM",
      "JP",
      "JE",
      "JO",
      "KZ",
      "KE",
      "KI",
      "KP",
      "KW",
      "KG",
      "LA",
      "LV",
      "LB",
      "LS",
      "LR",
      "LY",
      "LI",
      "LT",
      "LU",
      "MO",
      "MG",
      "MW",
      "MY",
      "MV",
      "ML",
      "MT",
      "MH",
      "MQ",
      "MR",
      "MU",
      "YT",
      "MX",
      "FM",
      "MD",
      "MC",
      "MN",
      "ME",
      "MS",
      "MA",
      "MZ",
      "MM",
      "NA",
      "NR",
      "NP",
      "NL",
      "NC",
      "NZ",
      "NI",
      "NE",
      "NG",
      "NU",
      "NF",
      "MK",
      "MP",
      "NO",
      "OM",
      "OA",
      "PK",
      "PW",
      "PS",
      "PA",
      "PG",
      "PY",
      "PE",
      "PH",
      "PN",
      "PL",
      "PT",
      "QA",
      "KR",
      "RE",
      "RO",
      "RU",
      "RW",
      "BL",
      "SH",
      "KN",
      "LC",
      "MF",
      "PM",
      "VC",
      "WS",
      "SM",
      "ST",
      "SA",
      "SN",
      "RS",
      "SC",
      "SL",
      "SG",
      "SX",
      "SK",
      "SI",
      "SB",
      "SO",
      "ZA",
      "GS",
      "SS",
      "ES",
      "LK",
      "SD",
      "SR",
      "SJ",
      "SZ",
      "SE",
      "CH",
      "SY",
      "TW",
      "TJ",
      "TZ",
      "TH",
      "TL",
      "TG",
      "TK",
      "TO",
      "TT",
      "TN",
      "TM",
      "TC",
      "TV",
      "TR",
      "UG",
      "UA",
      "AE",
      "GB",
      "US",
      "UM",
      "UY",
      "UZ",
      "VU",
      "VA",
      "VE",
      "VN",
      "VG",
      "WO",
      "WF",
      "EH",
      "YE",
      "ZM",
      "ZW",
      "EU",
      "EUR",
    ],
    id: "WO",
    updated: 1742438251200,
    name: "WIPO - WIPO",
    url: "http://www.wipo.int/portal/index.html.en",
    documentCount: 1445838,
  },
];
const Autocomplete = () => {
  // Assuming the "offices" dataset is already in scope and doesn't change.

  // Multiselect: store selected items.
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Lowercase search query.
  const lowerQuery = query.trim().toLowerCase();

  // Filter for offices that have at least one matching territory name.
  const officesByTerritory = useMemo(
    () =>
      lowerQuery
        ? offices.filter((office) =>
            office.territoryCodes.some(
              (code) =>
                territoryNames[code] &&
                territoryNames[code].toLowerCase().includes(lowerQuery),
            ),
          )
        : [],
    [lowerQuery],
  );

  // Filter for offices whose name matches the query.
  const officesByName = useMemo(
    () =>
      lowerQuery
        ? offices.filter((office) =>
            office.name.toLowerCase().includes(lowerQuery),
          )
        : [],
    [lowerQuery],
  );

  // If exactly one office matches by name, offer its territory names as suggestions.
  const singleOffice = officesByName.length === 1 ? officesByName[0] : null;

  const getTerritoryNames = (office: (typeof offices)[number]): string[] =>
    office.territoryCodes.map((code) => territoryNames[code]).filter(Boolean);

  const territorySuggestions =
    singleOffice && lowerQuery
      ? getTerritoryNames(singleOffice).filter((name) =>
          name.toLowerCase().includes(lowerQuery),
        )
      : [];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setActiveIndex(-1);
    setDropdownOpen(true);
  };

  // When an item is selected, add it if not already selected.
  // Do not clear the dropdown.
  const handleSelect = (value: string, e: MouseEvent<HTMLLIElement>) => {
    // Prevent immediate blur.
    e.preventDefault();
    if (!selectedItems.includes(value)) {
      setSelectedItems((prev) => [...prev, value]);
    }
    // Do not clear query so that dropdown remains open.
  };

  // Remove a tag.
  const removeItem = (item: string) => {
    setSelectedItems((prev) => prev.filter((i) => i !== item));
  };

  // Close dropdown when clicking outside.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent<Document>) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="w-xl mx-auto mt-10 relative">
      <label className="block font-medium mb-1">Territories/Offices</label>
      <div className="flex items-center gap-2 flex-wrap border border-gray-300 rounded p-2 focus-within:ring focus-within:border-blue-300">
        {selectedItems.map((item) => (
          <span
            key={item}
            className="flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
          >
            {item}
            <button
              className="ml-1 text-blue-600 hover:text-blue-800"
              onClick={() => removeItem(item)}
            >
              &times;
            </button>
          </span>
        ))}
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleChange}
          onFocus={() => setDropdownOpen(true)}
          className="flex-1 min-w-[100px] outline-none p-1"
        />
      </div>
      {dropdownOpen &&
        (officesByTerritory.length > 0 ||
          officesByName.length > 0 ||
          territorySuggestions.length > 0) && (
          <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded shadow mt-1 max-h-60 overflow-y-auto">
            {singleOffice && territorySuggestions.length > 0 ? (
              <>
                <li className="px-3 py-2 bg-gray-50 font-semibold text-sm">
                  Territories for {singleOffice.name}
                </li>
                {territorySuggestions.map((territory, index) => (
                  <li
                    key={territory}
                    className={`px-3 py-2 flex justify-between items-center cursor-pointer hover:bg-blue-100 ${
                      activeIndex === index ? "bg-blue-100" : ""
                    }`}
                    onMouseDown={(e) => handleSelect(territory, e)}
                  >
                    <span>{territory}</span>
                    {selectedItems.includes(territory) && (
                      <span className="text-green-600 font-bold">&#10003;</span>
                    )}
                  </li>
                ))}
              </>
            ) : (
              <>
                {officesByTerritory.length > 0 && (
                  <>
                    <li className="px-3 py-2 bg-gray-50 font-semibold text-sm">
                      Offices covering matching territory
                    </li>
                    {officesByTerritory.map((office, index) => (
                      <li
                        key={office.id}
                        className={`px-3 py-2 flex justify-between items-center cursor-pointer hover:bg-blue-100 ${
                          activeIndex === index ? "bg-blue-100" : ""
                        }`}
                        onMouseDown={(e) => handleSelect(office.name, e)}
                      >
                        <span>{office.name}</span>
                        {selectedItems.includes(office.name) && (
                          <span className="text-green-600 font-bold">
                            &#10003;
                          </span>
                        )}
                      </li>
                    ))}
                  </>
                )}
                {officesByName.length > 0 && (
                  <>
                    <li className="px-3 py-2 bg-gray-50 font-semibold text-sm">
                      Offices matching name
                    </li>
                    {officesByName.map((office, index) => (
                      <li
                        key={office.id}
                        className={`px-3 py-2 flex justify-between items-center cursor-pointer hover:bg-blue-100 ${
                          activeIndex === index ? "bg-blue-100" : ""
                        }`}
                        onMouseDown={(e) => handleSelect(office.name, e)}
                      >
                        <span>{office.name}</span>
                        {selectedItems.includes(office.name) && (
                          <span className="text-green-600 font-bold">
                            &#10003;
                          </span>
                        )}
                      </li>
                    ))}
                  </>
                )}
              </>
            )}
          </ul>
        )}
    </div>
  );
};

export default Autocomplete;
