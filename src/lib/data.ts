import { WebsiteCategory } from './types';
import { GithubOutlined, CodeOutlined, CloudOutlined, DatabaseOutlined, RobotOutlined, ToolOutlined, BookOutlined, GlobalOutlined } from '@ant-design/icons';

export const websiteCategories: WebsiteCategory[] = [
  {
    id: 'ai',
    name: 'AI工具',
    icon: 'RobotOutlined',
    description: '人工智能相关工具和网站',
    websites: [
      {
        id: 'chatgpt',
        name: 'ChatGPT',
        url: 'https://chat.openai.com',
        description: 'OpenAI开发的对话式人工智能聊天机器人',
        tags: ['AI', '聊天机器人']
      },
      {
        id: 'claude',
        name: 'Claude',
        url: 'https://claude.ai',
        description: 'Anthropic开发的AI助手',
        tags: ['AI', '聊天机器人']
      },
      {
        id: 'midjourney',
        name: 'Midjourney',
        url: 'https://www.midjourney.com',
        description: 'AI图像生成工具',
        tags: ['AI', '图像生成']
      },
      {
        id: 'huggingface',
        name: 'Hugging Face',
        url: 'https://huggingface.co',
        description: 'AI模型和数据集社区',
        tags: ['AI', '开源', '模型']
      },
      {
        id: 'stability',
        name: 'Stability AI',
        url: 'https://stability.ai',
        description: 'Stable Diffusion开发商',
        tags: ['AI', '图像生成']
      }
    ]
  },
  {
    id: 'dev',
    name: '开发工具',
    icon: 'CodeOutlined',
    description: '编程和开发相关工具',
    websites: [
      {
        id: 'github',
        name: 'GitHub',
        url: 'https://github.com',
        description: '代码托管和协作平台',
        tags: ['代码', '开源', '协作']
      },
      {
        id: 'vscode',
        name: 'VS Code',
        url: 'https://code.visualstudio.com',
        description: '微软开发的代码编辑器',
        tags: ['编辑器', '开发工具']
      },
      {
        id: 'stackoverflow',
        name: 'Stack Overflow',
        url: 'https://stackoverflow.com',
        description: '程序员问答社区',
        tags: ['问答', '社区']
      },
      {
        id: 'codepen',
        name: 'CodePen',
        url: 'https://codepen.io',
        description: '前端代码分享平台',
        tags: ['前端', '代码分享']
      },
      {
        id: 'vercel',
        name: 'Vercel',
        url: 'https://vercel.com',
        description: '前端部署平台',
        tags: ['部署', '前端']
      }
    ]
  },
  {
    id: 'cloud',
    name: '云服务',
    icon: 'CloudOutlined',
    description: '云计算和云存储服务',
    websites: [
      {
        id: 'aws',
        name: 'AWS',
        url: 'https://aws.amazon.com',
        description: '亚马逊云服务',
        tags: ['云计算', '服务器']
      },
      {
        id: 'azure',
        name: 'Azure',
        url: 'https://azure.microsoft.com',
        description: '微软云服务',
        tags: ['云计算', '服务器']
      },
      {
        id: 'gcp',
        name: 'Google Cloud',
        url: 'https://cloud.google.com',
        description: '谷歌云服务',
        tags: ['云计算', '服务器']
      },
      {
        id: 'cloudflare',
        name: 'Cloudflare',
        url: 'https://www.cloudflare.com',
        description: 'CDN和安全服务',
        tags: ['CDN', '安全']
      },
      {
        id: 'digitalocean',
        name: 'DigitalOcean',
        url: 'https://www.digitalocean.com',
        description: '简单易用的云服务器',
        tags: ['云计算', '服务器']
      }
    ]
  },
  {
    id: 'database',
    name: '数据库',
    icon: 'DatabaseOutlined',
    description: '数据库和数据存储服务',
    websites: [
      {
        id: 'mongodb',
        name: 'MongoDB',
        url: 'https://www.mongodb.com',
        description: 'NoSQL数据库',
        tags: ['数据库', 'NoSQL']
      },
      {
        id: 'mysql',
        name: 'MySQL',
        url: 'https://www.mysql.com',
        description: '关系型数据库',
        tags: ['数据库', 'SQL']
      },
      {
        id: 'postgresql',
        name: 'PostgreSQL',
        url: 'https://www.postgresql.org',
        description: '开源关系型数据库',
        tags: ['数据库', 'SQL']
      },
      {
        id: 'redis',
        name: 'Redis',
        url: 'https://redis.io',
        description: '内存数据结构存储',
        tags: ['数据库', '缓存']
      },
      {
        id: 'supabase',
        name: 'Supabase',
        url: 'https://supabase.com',
        description: '开源Firebase替代品',
        tags: ['数据库', 'BaaS']
      }
    ]
  },
  {
    id: 'tools',
    name: '实用工具',
    icon: 'ToolOutlined',
    description: '各类实用工具和服务',
    websites: [
      {
        id: 'notion',
        name: 'Notion',
        url: 'https://www.notion.so',
        description: '多功能笔记和协作工具',
        tags: ['笔记', '协作']
      },
      {
        id: 'figma',
        name: 'Figma',
        url: 'https://www.figma.com',
        description: '在线设计工具',
        tags: ['设计', 'UI']
      },
      {
        id: 'canva',
        name: 'Canva',
        url: 'https://www.canva.com',
        description: '在线平面设计工具',
        tags: ['设计', '图形']
      },
      {
        id: 'airtable',
        name: 'Airtable',
        url: 'https://airtable.com',
        description: '在线数据库和表格工具',
        tags: ['数据库', '表格']
      },
      {
        id: 'trello',
        name: 'Trello',
        url: 'https://trello.com',
        description: '项目管理工具',
        tags: ['项目管理', '协作']
      }
    ]
  },
  {
    id: 'learn',
    name: '学习资源',
    icon: 'BookOutlined',
    description: '编程和技术学习资源',
    websites: [
      {
        id: 'mdn',
        name: 'MDN Web Docs',
        url: 'https://developer.mozilla.org',
        description: 'Web技术文档',
        tags: ['文档', 'Web']
      },
      {
        id: 'freecodecamp',
        name: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org',
        description: '免费学习编程的平台',
        tags: ['学习', '编程']
      },
      {
        id: 'coursera',
        name: 'Coursera',
        url: 'https://www.coursera.org',
        description: '在线课程平台',
        tags: ['课程', '学习']
      },
      {
        id: 'udemy',
        name: 'Udemy',
        url: 'https://www.udemy.com',
        description: '在线学习平台',
        tags: ['课程', '学习']
      },
      {
        id: 'leetcode',
        name: 'LeetCode',
        url: 'https://leetcode.com',
        description: '编程题目练习平台',
        tags: ['算法', '面试']
      }
    ]
  },
  {
    id: 'other',
    name: '其他资源',
    icon: 'GlobalOutlined',
    description: '其他有用的网站和资源',
    websites: [
      {
        id: 'producthunt',
        name: 'Product Hunt',
        url: 'https://www.producthunt.com',
        description: '发现新产品的平台',
        tags: ['产品', '发现']
      },
      {
        id: 'hacker-news',
        name: 'Hacker News',
        url: 'https://news.ycombinator.com',
        description: '科技新闻和讨论',
        tags: ['新闻', '讨论']
      },
      {
        id: 'medium',
        name: 'Medium',
        url: 'https://medium.com',
        description: '博客发布平台',
        tags: ['博客', '文章']
      },
      {
        id: 'dev-to',
        name: 'DEV Community',
        url: 'https://dev.to',
        description: '程序员社区',
        tags: ['社区', '博客']
      },
      {
        id: 'dribbble',
        name: 'Dribbble',
        url: 'https://dribbble.com',
        description: '设计师作品展示平台',
        tags: ['设计', '灵感']
      }
    ]
  }
];