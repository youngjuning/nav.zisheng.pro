import React, { useEffect, useCallback } from 'react';
import { Menu } from 'antd';
import { WebsiteCategory } from '@/lib/types';
import * as Icons from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useHashValue } from '@/lib/hooks';

interface CategoryMenuProps {
  categories: WebsiteCategory[];
  selectedCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
}

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

  // 优化选中逻辑，优先使用selectedCategory（由滚动触发），其次使用hash（由URL触发）
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

export default CategoryMenu;