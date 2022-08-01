import { MenuEntry } from '@robustswap-libs/uikit'

const configtw: MenuEntry[] = [
  {
    label: "\u9996\u9801",
    icon: 'HomeIcon',
    href: 'https://robustswap.com',
  },
  {
    label: "\u4ea4\u6613",
    icon: 'TradeIcon',
    href: '/swap',
  },
  {
    label: "\u8fb2\u5834",
    icon: 'FarmIcon',
    href: 'https://robustswap.com/farms',
  },
  {
    label: "\u8cc7\u91d1\u6c60",
    icon: 'PoolIcon',
    href: 'https://robustswap.com/pools',
  },
  {
    label: "推薦總數",
    icon: 'ReferralIcon',
    href: 'https://robustswap.com/referrals',
  },
  {
    label: "Divider",
    icon: "",
    href: "",
  },
  {
    label: "審計",
    icon: 'AuditIcon',
    href: 'https://docs.robustswap.com/security/audits',
  },
  {
    label: "商品清單",
    icon: 'ListingIcon',
    items: [
      {
        label: "BSCScan",
        href: "https://bscscan.com/address/0x95336aC5f7E840e7716781313e1607F7C9D6BE25",
      },
      {
        label: "DappRadar",
        href: "https://docs.robustswap.com/more/links",
      },
      {
        label: "Coingecko",
        href: "https://docs.robustswap.com/more/links",
      },
      {
        label: "CoinMarketCap",
        href: "https://docs.robustswap.com/more/links",
      },
      {
        label: "LiveCoinWatch",
        href: "https://docs.robustswap.com/more/links",
      },
      {
        label: "Vfat",
        href: "https://vfat-tools.robustswap.com/",
      }
    ]
  },
  {
    label: "特徵",
    icon: "FeatureIcon",
    items: [
      {
        label: "反機器人",
        href: "https://docs.robustswap.com/tokenomics/anti-bot",
      },
      {
        label: "自動流動性",
        href: "https://docs.robustswap.com/tokenomics/automatic-liquidity",
      },
      {
        label: "反傾銷",
        href: "https://docs.robustswap.com/tokenomics/anti-dumping",
      },
      {
        label: "智能燃燒",
        href: "https://docs.robustswap.com/tokenomics/smart-burning",
      },
      {
        label: "收穫間隔",
        href: "https://docs.robustswap.com/tokenomics/harvest-interval",
      },
      {
        label: "推薦獎勵",
        href: "https://docs.robustswap.com/get-rbs/referral",
      },
      {
        label: "時間鎖",
        href: "https://docs.robustswap.com/security/timelock",
      },
      {
        label: "遷移代碼",
        href: "https://docs.robustswap.com/security/migrator-code",
      },
    ]
  },
  {
    label: "圖表",
    icon: "ChartIcon",
    items: [
      {
        label: "Poocoin",
        href: "https://poocoin.app/tokens/0x95336ac5f7e840e7716781313e1607f7c9d6be25",
      },
      {
        label: "DexTools",
        href: "https://www.dextools.io/app/bsc/pair-explorer/0x4f8fd7b0a83e506d022d45ce0913bdd89596cf25",
      },
      {
        label: "DexGuru",
        href: "https://dex.guru/token/0x95336ac5f7e840e7716781313e1607f7c9d6be25-bsc",
      },
      {
        label: "Bogged",
        href: "https://charts.bogged.finance/0x95336aC5f7E840e7716781313e1607F7C9D6BE25",
      }
    ]
  },
  {
    label: "\u66f4\u591a",
    icon: 'MoreIcon',
    items: [
      {
        label: "GitHub",
        href: "https://github.com/robustprotocol",
      },
      {
        label: "GitBook",
        href: "https://docs.robustswap.com",
      },
      {
        label: "路線圖",
        href: "https://docs.robustswap.com/roadmap",
      },
      {
        label: "表決",
        href: "https://docs.robustswap.com/more/links",
      },
      {
        label: "影片",
        href: "https://docs.robustswap.com/more/links",
      }
    ]
  },
]

export default configtw
