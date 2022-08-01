import { MenuEntry } from '@robustswap-libs/uikit'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: 'https://robustswap.com',
  },
  {
    label: 'Exchange',
    icon: 'TradeIcon',
    href: '/swap',
  },
  {
    label: 'Farms',
    icon: 'FarmIcon',
    href: 'https://robustswap.com/farms',
  },
  {
    label: 'Pools',
    icon: 'PoolIcon',
    href: 'https://robustswap.com/pools',
  },
  {
    label: 'Referrals',
    icon: 'ReferralIcon',
    href: 'https://robustswap.com/referrals',
  },
  {
    label: "Divider",
    icon: "",
    href: "",
  },
  {
    label: 'Audit',
    icon: 'AuditIcon',
    href: "https://docs.robustswap.com/security/audits"
  },
  {
    label: "Listings",
    icon: "ListingIcon",
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
    label: "Features",
    icon: "FeatureIcon",
    items: [
      {
        label: "Anti-Bot",
        href: "https://docs.robustswap.com/tokenomics/anti-bot",
      },
      {
        label: "Automatic Liquidity",
        href: "https://docs.robustswap.com/tokenomics/automatic-liquidity",
      },
      {
        label: "Anti-Dumping",
        href: "https://docs.robustswap.com/tokenomics/anti-dumping",
      },
      {
        label: "Smart Burning",
        href: "https://docs.robustswap.com/tokenomics/smart-burning",
      },
      {
        label: "Harvest Interval",
        href: "https://docs.robustswap.com/tokenomics/harvest-interval",
      },
      {
        label: "Referral Reward",
        href: "https://docs.robustswap.com/get-rbs/referral",
      },
      {
        label: "Timelock",
        href: "https://docs.robustswap.com/security/timelock",
      },
      {
        label: "Migrator Code",
        href: "https://docs.robustswap.com/security/migrator-code",
      },
    ]
  },
  {
    label: "Charts",
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
    label: "More",
    icon: "MoreIcon",
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
        label: "Roadmap",
        href: "https://docs.robustswap.com/roadmap",
      },
      {
        label: "Voting",
        href: "https://docs.robustswap.com/more/links",
      },
      {
        label: "Videos",
        href: "https://docs.robustswap.com/more/links",
      }
    ]
  }
]

export default config