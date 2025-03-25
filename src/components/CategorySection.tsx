import React, { useEffect, useState } from 'react';
import { Typography, Row, Col, Divider } from 'antd';
import { WebsiteCategory } from '@/lib/types';
import WebsiteCard from './WebsiteCard';
import * as Icons from '@ant-design/icons';
import { useIntersectionObserver } from '@/lib/hooks';

const { Title, Paragraph } = Typography;

interface CategorySectionProps {
  category: WebsiteCategory;
  onVisibilityChange?: (categoryId: string, isVisible: boolean, ratio?: number) => void;
}

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

export default CategorySection;