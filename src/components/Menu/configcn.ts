import { MenuEntry } from '@robustswap-libs/uikit'

const configcn: MenuEntry[] = [
  {
    label: "\u9996\u9875",
    icon: 'HomeIcon',
    href: 'https://robustswap.com',
  },
  {
    label: "\u4ea4\u6613",
    icon: 'TradeIcon',
    href: '/swap',
  },
  {
    label: "\u519c\u573a",
    icon: 'FarmIcon',
    href: 'https://robustswap.com/farms',
  },
  {
    label: "\u8d44\u91d1\u6c60",
    icon: 'PoolIcon',
    href: 'https://robustswap.com/pools',
  },
  {
    label: "推荐总数",
    icon: 'ReferralIcon',
    href: 'https://robustswap.com/referrals',
  },
  {
    label: "Divider",
    icon: "",
    href: "/",
  },
  {
    label: "审计",
    icon: 'AuditIcon',
    href: 'https://docs.robustswap.com/security/audits',
  },
  {
    label: "商品清单",
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
    label: "特征",
    icon: "FeatureIcon",
    items: [
      {
        label: "反机器人",
        href: "https://docs.robustswap.com/tokenomics/anti-bot",
      },
      {
        label: "自动流动性",
        href: "https://docs.robustswap.com/tokenomics/automatic-liquidity",
      },
      {
        label: "反倾销",
        href: "https://docs.robustswap.com/tokenomics/anti-dumping",
      },
      {
        label: "智能燃烧",
        href: "https://docs.robustswap.com/tokenomics/smart-burning",
      },
      {
        label: "收获间隔",
        href: "https://docs.robustswap.com/tokenomics/harvest-interval",
      },
      {
        label: "推荐奖励",
        href: "https://docs.robustswap.com/get-rbs/referral",
      },
      {
        label: "时间锁",
        href: "https://docs.robustswap.com/security/timelock",
      },
      {
        label: "迁移代码",
        href: "https://docs.robustswap.com/security/migrator-code",
      },
    ]
  },
  {
    label: "图表",
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
        label: "路线图",
        href: "https://docs.robustswap.com/roadmap",
      },
      {
        label: "表决",
        href: "https://docs.robustswap.com/more/links",
      },
      {
        label: "影片",
        href: "https://docs.robustswap.com/more/links",
      }
    ]
  },
]

export default configcn
