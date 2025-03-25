'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Layout as AntLayout, Affix } from 'antd';
import { websiteCategories } from '@/lib/data';
import Layout from '@/components/Layout';
import CategorySection from '@/components/CategorySection';
import CategoryMenu from '@/components/CategoryMenu';
import { SearchParams } from '@/lib/types';
import { useHashValue } from '@/lib/hooks';

const { Sider, Content } = AntLayout;
const { Title } = Typography;

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
