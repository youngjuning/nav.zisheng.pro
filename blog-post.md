# 从零开始打造一个现代化的AI导航站

![封面图](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d5bee8b7c7e74c6f9d944996d71f85b0~tplv-k3u1fbpfcp-zoom-crop-mark:1512:1512:1512:851.awebp)

## 前言

随着AI工具和开发资源的爆炸式增长，我们经常需要在各种网站和工具之间切换。为了解决这个问题，我决定开发一个现代化的导航站，集成常用的AI工具、开发资源和云服务等，并且实现平滑的滚动和菜单联动效果。本文将详细记录整个实现过程，包括技术选型、组件设计、样式处理和交互优化等方面。

## 技术栈选择

在开始项目之前，我首先确定了技术栈：

- **Next.js 15**：最新版本的React框架，提供了优秀的性能和开发体验
- **React 19**：最新版本的React库，带来了更好的性能和新特性
- **TypeScript**：提供类型安全，减少运行时错误
- **Ant Design 5**：成熟的UI组件库，提供丰富的组件和设计规范
- **Tailwind CSS 4**：原子化CSS框架，提高开发效率

这个技术栈组合可以帮助我们快速构建现代化的Web应用，同时保持良好的开发体验和性能。

## 项目结构设计

我采用了Next.js的App Router结构，整体项目结构如下：

```
/src
  /app
    layout.tsx  # 根布局
    page.tsx    # 主页面
    globals.css # 全局样式
  /components
    Layout.tsx         # 布局组件
    CategoryMenu.tsx   # 分类菜单组件
    CategorySection.tsx # 分类区域组件
    WebsiteCard.tsx    # 网站卡片组件
  /lib
    data.ts     # 数据源
    hooks.ts    # 自定义Hook
    types.ts    # 类型定义
```

这种结构清晰地分离了页面、组件和数据，便于维护和扩展。

## 数据模型设计

首先，我定义了网站分类和网站的数据模型：

```typescript
// types.ts
export interface WebsiteCategory {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  websites: Website[];
}

export interface Website {
  id: string;
  name: string;
  url: string;
  icon?: string;
  description?: string;
  tags?: string[];
}

export interface SearchParams {
  keyword: string;
  category?: string;
}
```

然后，在`data.ts`中创建了初始数据：

```typescript
// data.ts (部分代码)
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
      // 更多网站...
    ]
  },
  // 更多分类...
];
```

## 自定义Hook实现

为了实现平滑滚动和菜单联动效果，我创建了两个自定义Hook：

### 1. useIntersectionObserver

这个Hook利用IntersectionObserver API监测元素的可见性：

```typescript
// hooks.ts
export function useIntersectionObserver<T extends HTMLElement>(
  options: IntersectionObserverInit = { threshold: [0.1, 0.2, 0.3, 0.4, 0.5] }
): [RefObject<T>, boolean, number] {
  const elementRef = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [intersectionRatio, setIntersectionRatio] = useState(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setIsVisible(entry.isIntersecting);
      setIntersectionRatio(entry.intersectionRatio);
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [options]);

  return [elementRef, isVisible, intersectionRatio];
}
```

### 2. useHashValue

这个Hook用于管理URL哈希值，实现URL与页面状态的同步：

```typescript
// hooks.ts
export function useHashValue(initialHash: string = ''): [string, (hash: string) => void] {
  const [hash, setHash] = useState(() => {
    // 如果在浏览器环境，从URL获取初始哈希值
    if (typeof window !== 'undefined') {
      return window.location.hash.replace('#', '') || initialHash;
    }
    return initialHash;
  });

  const updateHash = (newHash: string) => {
    if (typeof window !== 'undefined') {
      // 更新URL哈希值但不触发页面滚动
      window.history.pushState(null, '', `#${newHash}`);
      setHash(newHash);
    }
  };

  // 监听哈希值变化
  useEffect(() => {
    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      setHash(newHash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return [hash, updateHash];
}
```

## 组件实现

### 1. WebsiteCard组件

这个组件用于展示单个网站的信息：

```tsx
// WebsiteCard.tsx
const WebsiteCard: React.FC<WebsiteCardProps> = ({ website }) => {
  return (
    <Card 
      hoverable 
      className="h-full flex flex-col"
      actions={[
        <a 
          key="visit" 
          href={website.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center"
        >
          <LinkOutlined className="mr-1" /> 访问
        </a>
      ]}
    >
      <div className="flex-1">
        <Title level={4} className="mb-2">{website.name}</Title>
        <Text type="secondary" className="block mb-3">{website.description}</Text>
        <Space size={[0, 8]} wrap>
          {website.tags?.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Space>
      </div>
    </Card>
  );
};
```

### 2. CategorySection组件

这个组件用于展示一个分类及其包含的网站：

```tsx
// CategorySection.tsx
const CategorySection: React.FC<CategorySectionProps> = ({ category, onVisibilityChange }) => {
  // 动态获取图标组件
  const IconComponent = category.icon && (Icons as any)[category.icon];
  
  // 使用IntersectionObserver监测分类区域的可见性
  const [sectionRef, isVisible, intersectionRatio] = useIntersectionObserver<HTMLDivElement>({ 
    threshold: [0.1, 0.2, 0.3, 0.4, 0.5], // 使用多个阈值提高精度
    rootMargin: '-80px 0px -200px 0px' // 调整检测区域，使顶部更敏感
  });
  
  // 当可见性变化时通知父组件
  useEffect(() => {
    if (onVisibilityChange) {
      onVisibilityChange(category.id, isVisible, intersectionRatio);
    }
  }, [isVisible, intersectionRatio, category.id, onVisibilityChange]);

  return (
    <div className="mb-12" id={category.id} ref={sectionRef}>
      <div className="flex items-center mb-4">
        {IconComponent && <IconComponent className="mr-2 text-xl" />}
        <Title level={3} className="m-0">{category.name}</Title>
      </div>
      {category.description && (
        <Paragraph type="secondary" className="mb-6">
          {category.description}
        </Paragraph>
      )}
      <Row gutter={[16, 16]}>
        {category.websites.map(website => (
          <Col xs={24} sm={12} md={8} lg={6} key={website.id}>
            <WebsiteCard website={website} />
          </Col>
        ))}
      </Row>
      <Divider className="mt-8" />
    </div>
  );
};
```

### 3. CategoryMenu组件

这个组件实现了左侧的分类菜单：

```tsx
// CategoryMenu.tsx
const CategoryMenu: React.FC<CategoryMenuProps> = ({ categories, selectedCategory, onCategoryChange }) => {
  const router = useRouter();
  const [hash, updateHash] = useHashValue();

  // 当点击菜单项时
  const handleClick = (categoryId: string) => {
    // 更新URL哈希值
    updateHash(categoryId);
    
    // 使用锚点导航到对应的分类区域
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    
    // 通知父组件选中的分类已更改
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };
  
  // 当URL哈希值变化时，自动滚动到对应区域
  useEffect(() => {
    if (hash && !selectedCategory) {
      const element = document.getElementById(hash);
      if (element) {
        // 使用较小的延迟确保DOM已完全加载
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
          
          // 通知父组件选中的分类已更改
          if (onCategoryChange) {
            onCategoryChange(hash);
          }
        }, 100);
      }
    }
  }, [hash, selectedCategory, onCategoryChange]);

  return (
    <Menu
      mode="vertical"
      selectedKeys={selectedCategory ? [selectedCategory] : (hash ? [hash] : [])}
      className="border-r-0"
      style={{ transition: 'all 0.3s ease' }}
    >
      {categories.map(category => {
        // 动态获取图标组件
        const IconComponent = category.icon && (Icons as any)[category.icon];
        
        return (
          <Menu.Item 
            key={category.id} 
            icon={IconComponent && <IconComponent />}
            onClick={() => handleClick(category.id)}
          >
            {category.name}
          </Menu.Item>
        );
      })}
    </Menu>
  );
};
```

## 主页面实现

主页面整合了所有组件，并实现了核心逻辑：

```tsx
// page.tsx
export default function Home() {
  const [searchParams, setSearchParams] = useState<SearchParams>({ keyword: '' });
  const [filteredCategories, setFilteredCategories] = useState(websiteCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [hash, updateHash] = useHashValue();
  
  // 存储当前可见的分类区域及其可见比例
  const [visibleCategories, setVisibleCategories] = useState<Record<string, {isVisible: boolean, ratio: number}>>({});

  // 处理搜索
  const handleSearch = (keyword: string) => {
    setSearchParams({ ...searchParams, keyword });
  };
  
  // 处理分类菜单项点击
  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);
  
  // 处理分类区域可见性变化
  const handleVisibilityChange = useCallback((categoryId: string, isVisible: boolean, ratio: number = 0) => {
    setVisibleCategories(prev => ({
      ...prev,
      [categoryId]: { isVisible, ratio }
    }));
  }, []);
  
  // 当可见分类变化时，更新选中的分类
  useEffect(() => {
    // 获取所有可见的分类
    const visible = Object.entries(visibleCategories)
      .filter(([_, data]) => data.isVisible)
      .map(([id, data]) => ({ id, ratio: data.ratio }));
    
    // 如果有可见分类，选择可见比例最高的一个作为当前选中分类
    if (visible.length > 0) {
      // 首先按照可见比例排序
      visible.sort((a, b) => b.ratio - a.ratio);
      
      // 如果最高可见比例大于阈值，则选择该分类
      if (visible[0].ratio > 0.2) {
        const topCategory = visible[0].id;
        
        // 只有当选中分类变化时才更新状态
        if (selectedCategory !== topCategory) {
          setSelectedCategory(topCategory);
          // 更新URL哈希值，但不触发滚动
          if (hash !== topCategory) {
            updateHash(topCategory);
          }
        }
      } else {
        // 如果所有分类的可见比例都较低，则使用位置信息作为辅助判断
        const positions = visible.map(({ id }) => {
          const element = document.getElementById(id);
          if (!element) return { id, top: Infinity };
          const rect = element.getBoundingClientRect();
          return { id, top: rect.top };
        });
        
        // 按照距离视口顶部的距离排序，选择最靠近顶部的分类
        positions.sort((a, b) => a.top - b.top);
        const topCategory = positions[0].id;
        
        // 只有当选中分类变化时才更新状态
        if (selectedCategory !== topCategory) {
          setSelectedCategory(topCategory);
          // 更新URL哈希值，但不触发滚动
          if (hash !== topCategory) {
            updateHash(topCategory);
          }
        }
      }
    }
  }, [visibleCategories, selectedCategory, hash, updateHash]);

  // 根据搜索关键词过滤网站
  useEffect(() => {
    if (!searchParams.keyword) {
      setFilteredCategories(websiteCategories);
      return;
    }

    const keyword = searchParams.keyword.toLowerCase();
    const filtered = websiteCategories.map(category => {
      const filteredWebsites = category.websites.filter(website => {
        return (
          website.name.toLowerCase().includes(keyword) ||
          (website.description && website.description.toLowerCase().includes(keyword)) ||
          (website.tags && website.tags.some(tag => tag.toLowerCase().includes(keyword)))
        );
      });

      return {
        ...category,
        websites: filteredWebsites
      };
    }).filter(category => category.websites.length > 0);

    setFilteredCategories(filtered);
  }, [searchParams]);

  return (
    <Layout onSearch={handleSearch}>
      <AntLayout className="bg-transparent">
        <Affix offsetTop={20}>
          <Sider 
            width={200} 
            style={{backgroundColor: 'transparent'}}
          >
            <CategoryMenu 
              categories={websiteCategories} 
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </Sider>
        </Affix>
        <Content className="pl-8">
          <div className="mb-8">
            <Title level={2}>网站导航</Title>
            <p className="text-gray-500">收集了各种有用的网站和工具，方便快速访问。</p>
          </div>

          {filteredCategories.length > 0 ? (
            filteredCategories.map(category => (
              <CategorySection 
                key={category.id} 
                category={category} 
                onVisibilityChange={handleVisibilityChange}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-lg">没有找到匹配的网站，请尝试其他关键词。</p>
            </div>
          )}
        </Content>
      </AntLayout>
    </Layout>
  );
}
```

## 解决Tailwind与Ant Design样式冲突

在项目中同时使用Tailwind CSS和Ant Design时，可能会遇到样式冲突问题。我采用了以下策略解决这个问题：

1. **使用前缀类名**：在Tailwind配置中使用前缀，避免与Ant Design的类名冲突。

2. **优先使用Tailwind的工具类**：对于布局和间距等样式，优先使用Tailwind的原子类，保持样式的一致性。

3. **组件级别的样式隔离**：对于复杂组件，使用CSS Modules或styled-components进行样式隔离。

4. **明确的样式优先级**：在必要时使用`!important`或更具体的选择器提高样式优先级。

## 实现平滑滚动与菜单联动

实现平滑滚动与菜单联动是本项目的核心功能之一，主要通过以下步骤实现：

1. **使用IntersectionObserver监测可见性**：通过`useIntersectionObserver`自定义Hook监测每个分类区域的可见性。

2. **计算最佳可见分类**：根据可见比例和位置信息，计算当前应该选中的分类。

3. **双向绑定**：实现菜单点击滚动到对应区域，以及滚动时自动更新菜单选中状态。

4. **URL同步**：使用URL哈希值同步当前选中的分类，支持刷新页面后恢复状态。

这种实现方式不仅提供了良好的用户体验，还保持了URL的可分享性。

## 性能优化

为了提高应用性能，我采取了以下优化措施：

1. **使用React.memo和useCallback**：减少不必要的重渲染。

2. **懒加载和代码分割**：减少初始加载时间。

3. **优化IntersectionObserver**：使用适当的阈值和根边距，减少不必要的回调触发。

4. **状态管理优化**：只在必要时更新状态，避免级联更新。

## 总结与展望

通过这个项目，我成功实现了一个现代化的AI导航站，具有以下特点：

- **美观的UI**：使用Ant Design和Tailwind CSS实现现代化的界面设计。
- **平滑的交互**：实现了平滑滚动和菜单联动效果。
- **响应式布局**：适配各种屏幕尺寸。
- **搜索功能**：支持按关键词搜索网站。
- **URL同步**：使用URL哈希值同步当前状态。

未来可以考虑添加以下功能：

- **用户自定义分类和网站**：允许用户添加自己的网站和分类。
- **收藏功能**：支持用户收藏常用网站。
- **暗黑模式**：支持切换暗黑模式。
- **国际化**：支持多语言。

通过这个项目，我不仅实现了一个实用的导航站，还深入学习了React的高级特性和现代前端开发技术。希望这篇文章能对你有所帮助！

---

如果你对这个项目感兴趣，可以在GitHub上查看完整代码：[nav.zisheng.pro](https://github.com/zishengpro/nav.zisheng.pro)

欢迎点赞、评论和分享，谢谢阅读！